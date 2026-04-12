import type { SidecarClient } from "../client.js"
import type { PluginConfig } from "../types.js"
import { randomUUID } from "node:crypto"

// Per-session state: how many turns have already been forwarded to the sidecar.
// Lets agent_end fire per-turn with a full history snapshot while we only
// enqueue the *new* turn(s) since the previous attempt.
const sessionTurnCounts = new Map<string, number>()

export function registerAutoCapture(
  api: any,
  getClient: () => SidecarClient,
  config: PluginConfig,
): void {
  if (!config.autoCapture) return

  api.on(
    "agent_end",
    async (event: Record<string, unknown>, ctx: Record<string, unknown>) => {
      try {
        if (!event.success) return
        const messages = event.messages as unknown[] | undefined
        if (!Array.isArray(messages) || messages.length === 0) return

        const sessionId =
          (ctx?.sessionId as string) ||
          (event.sessionId as string) ||
          randomUUID()

        const allTurns = extractTurns(messages)
        const alreadySent = sessionTurnCounts.get(sessionId) ?? 0
        const newTurns = allTurns.slice(alreadySent)
        if (newTurns.length === 0) return

        const client = getClient()
        for (const turn of newTurns) {
          const res = await client.bufferTurn(sessionId, turn, config.scope)
          if (res.flushed && res.added && res.added > 0) {
            api.logger.info(
              `metaclaw-memory: incremental flush added ${res.added} memories (session=${sessionId})`,
            )
          }
        }
        sessionTurnCounts.set(sessionId, allTurns.length)
      } catch (err) {
        api.logger.error("metaclaw-memory: auto-capture buffer_turn failed", err)
      }
    },
  )

  api.on(
    "session_end",
    async (event: Record<string, unknown>, ctx: Record<string, unknown>) => {
      try {
        const sessionId =
          (event?.sessionId as string | undefined) ??
          (ctx?.sessionId as string | undefined)
        if (!sessionId) return
        if (!sessionTurnCounts.has(sessionId)) return
        const client = getClient()
        const res = await client.flushSession(sessionId, config.scope, true)
        if (res.added > 0) {
          api.logger.info(
            `metaclaw-memory: final flush added ${res.added} memories (session=${sessionId})`,
          )
        }
        sessionTurnCounts.delete(sessionId)
      } catch (err) {
        api.logger.error("metaclaw-memory: auto-capture flush_session failed", err)
      }
    },
  )
}

interface Turn {
  prompt_text: string
  response_text: string
}

function extractTurns(messages: unknown[]): Turn[] {
  const turns: Turn[] = []
  let pendingPrompt: string | null = null

  for (const msg of messages) {
    if (!msg || typeof msg !== "object") continue
    const m = msg as Record<string, unknown>
    const text = extractText(m.content)
    if (!text) continue

    if (m.role === "user") {
      pendingPrompt = text
    } else if (m.role === "assistant" && pendingPrompt) {
      turns.push({ prompt_text: pendingPrompt, response_text: text })
      pendingPrompt = null
    }
  }
  return turns
}

function extractText(content: unknown): string | null {
  if (typeof content === "string") return content
  if (Array.isArray(content)) {
    const parts: string[] = []
    for (const block of content) {
      if (!block || typeof block !== "object") continue
      const b = block as Record<string, unknown>
      if (b.type === "text" && typeof b.text === "string") {
        parts.push(b.text)
      }
    }
    return parts.length > 0 ? parts.join("\n") : null
  }
  return null
}
