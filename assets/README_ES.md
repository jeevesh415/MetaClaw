<div align="center">

<img src="logo.jpg" alt="MetaClaw" width="600">

<br/>

### Habla con tu agente — aprende y *EVOLUCIONA*.

<p>
  <a href="https://github.com/aiming-lab/MetaClaw"><img src="https://img.shields.io/badge/github-MetaClaw-181717?style=flat&labelColor=555&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat&labelColor=555" alt="License MIT"></a>
  <img src="https://img.shields.io/badge/⚡_Totalmente_Async-yellow?style=flat&labelColor=555" alt="Fully Async" />
  <img src="https://img.shields.io/badge/☁️_Sin_Cluster_GPU-blue?style=flat&labelColor=555" alt="No GPU Cluster" />
  <img src="https://img.shields.io/badge/🛠️_Evolución_de_Skills-orange?style=flat&labelColor=555" alt="Skill Evolution" />
  <img src="https://img.shields.io/badge/🚀_Deploy_en_1_clic-green?style=flat&labelColor=555" alt="One-Click Deploy" />
</p>

<br/>

[🇺🇸 English](../README.md) • [🇨🇳 中文](./README_ZH.md) • [🇯🇵 日本語](./README_JA.md) • [🇰🇷 한국어](./README_KO.md) • [🇫🇷 Français](./README_FR.md) • [🇩🇪 Deutsch](./README_DE.md)

<br/>

[Descripción](#-descripción) • [Inicio rápido](#-inicio-rápido) • [CLI](#️-referencia-cli) • [Configuración](#️-configuración) • [Skills](#-skills) • [Modo RL](#-avanzado-modo-rl) • [Citar](#-citar)

</div>

---

<div align="center">

### Dos comandos. Eso es todo.

```bash
metaclaw setup              # asistente de configuración inicial
metaclaw start              # por defecto: modo auto — skills + entrenamiento RL programado
metaclaw start --mode rl    # RL sin planificador (entrena inmediatamente al llenar batch)
metaclaw start --mode skills_only  # solo skills, sin RL (no requiere Tinker)
```

<img src="metaclaw.gif" alt="Demo de MetaClaw" width="700">

</div>

---

## 🔥 Novedades

- **[11/03/2026]** **v0.2** — Despliegue en un clic mediante el CLI `metaclaw`. Inyección de skills activada por defecto, RL ahora es opcional.
- **[09/03/2026]** Lanzamiento oficial de **MetaClaw** — Habla con tu agente y deja que evolucione automáticamente. Sin cluster GPU requerido.

---

## 📖 Descripción

**MetaClaw convierte conversaciones reales en datos de entrenamiento continuos — automáticamente.**
Habla con tu agente como siempre, y MetaClaw gestiona el bucle de aprendizaje en segundo plano.

Envuelve tu modelo detrás de un proxy compatible con OpenAI, intercepta interacciones desde OpenClaw, inyecta skills relevantes en cada turno y resume automáticamente nuevas skills al final de cada sesión. Opcionalmente, activa el RL en la nube de Tinker para fine-tuning continuo con hot-swap de pesos sin interrumpir el servicio.

No se necesita cluster GPU. El modo `skills_only` funciona con cualquier API de LLM, y el entrenamiento RL se delega a la nube de [Tinker](https://www.thinkingmachines.ai/tinker/).

---

## 🚀 Inicio rápido

### 1. Instalación

```bash
pip install -e .            # modo skills_only (ligero)
pip install -e ".[rl]"      # + soporte de entrenamiento RL
pip install -e ".[evolve]"  # + resumen automático de skills
```

### 2. Configuración

```bash
metaclaw setup
```

El asistente interactivo te pedirá que elijas tu proveedor de LLM (Kimi, Qwen o personalizado), tu clave API y si deseas activar el entrenamiento RL.

### 3. Iniciar

```bash
metaclaw start
```

Listo. MetaClaw inicia el proxy, configura OpenClaw automáticamente y reinicia la pasarela. Abre OpenClaw y empieza a chatear — las skills se inyectan en cada turno y se resumen automáticamente al terminar la sesión.

---

## 🛠️ Referencia CLI

```
metaclaw setup              # Asistente de configuración inicial
metaclaw start              # Iniciar MetaClaw (por defecto: modo auto)
metaclaw start --mode rl    # Forzar modo RL (sin planificador)
metaclaw start --mode skills_only  # Forzar modo solo skills
metaclaw stop               # Detener una instancia de MetaClaw en ejecución
metaclaw status             # Ver estado del proxy y modo activo
metaclaw config show        # Ver configuración completa actual
metaclaw config KEY VALUE   # Establecer un valor de configuración
```

**Comandos de configuración habituales:**

```bash
metaclaw config rl.enabled true           # Activar entrenamiento RL
metaclaw config rl.tinker_api_key sk-...  # Establecer clave Tinker
metaclaw config skills.auto_evolve false  # Desactivar resumen automático
metaclaw config proxy.port 31000          # Cambiar puerto del proxy
```

---

## ⚙️ Configuración

La configuración se guarda en `~/.metaclaw/config.yaml`, creado por `metaclaw setup`.

```yaml
mode: auto                 # "auto" | "rl" | "skills_only"

llm:
  provider: kimi            # kimi | qwen | openai | custom
  model_id: moonshotai/Kimi-K2.5
  api_base: https://api.moonshot.cn/v1
  api_key: sk-...

proxy:
  port: 30000

skills:
  enabled: true
  dir: ~/.metaclaw/skills
  retrieval_mode: template  # template | embedding
  top_k: 6
  auto_evolve: true

rl:
  enabled: false
  tinker_api_key: ""
  prm_url: https://api.openai.com/v1
  prm_api_key: ""
```

---

## 💪 Skills

Las skills son instrucciones Markdown cortas inyectadas en el system prompt del agente en cada turno. Se almacenan en `~/.metaclaw/skills/` como archivos `SKILL.md` individuales.

**El resumen automático de skills** se ejecuta tras cada conversación. El LLM configurado analiza la sesión y genera nuevas skills automáticamente. Sin curaduría manual — la biblioteca crece con el uso.

Para precargar el banco de skills integrado (40+ skills):

```bash
cp -r memory_data/skills/* ~/.metaclaw/skills/
```

---

## 🔬 Avanzado: Modo RL

```bash
metaclaw config rl.enabled true
metaclaw config rl.tinker_api_key sk-...
metaclaw config rl.prm_url https://api.openai.com/v1
metaclaw config rl.prm_api_key sk-...
metaclaw start
```

En modo RL, cada turno de conversación se tokeniza y se envía como muestra de entrenamiento. Un LLM juez (PRM) puntúa las respuestas de forma asíncrona, y Tinker Cloud ejecuta el fine-tuning LoRA.

---

## 📚 Citar

```bibtex
@misc{xia2026metaclaw,
  author       = {Xia, Peng and Chen, Jianwen and Yang, Xinyu and Han, Siwei and Qiu, Shi and Zheng, Zeyu and Xie, Cihang and Yao, Huaxiu},
  title        = {MetaClaw},
  year         = {2026},
  organization = {GitHub},
  url          = {https://github.com/aiming-lab/MetaClaw},
}
```

---

## 🙏 Agradecimientos

- [OpenClaw](https://openclaw.ai) – el framework principal del agente
- [SkillRL](https://github.com/aiming-lab/SkillRL) – nuestro framework RL con skills
- [Tinker](https://www.thinkingmachines.ai/tinker/) – entrenamiento RL en la nube
- [OpenClaw-RL](https://github.com/Gen-Verse/OpenClaw-RL) – inspiración para nuestro diseño RL
- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) – base de nuestro banco de skills

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
