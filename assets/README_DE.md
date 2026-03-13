<div align="center">

<img src="logo.jpg" alt="MetaClaw" width="600">

<br/>

### Sprich mit deinem Agenten — er lernt und *ENTWICKELT* sich.

<p>
  <a href="https://github.com/aiming-lab/MetaClaw"><img src="https://img.shields.io/badge/github-MetaClaw-181717?style=flat&labelColor=555&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat&labelColor=555" alt="License MIT"></a>
  <img src="https://img.shields.io/badge/⚡_Vollständig_Async-yellow?style=flat&labelColor=555" alt="Fully Async" />
  <img src="https://img.shields.io/badge/☁️_Kein_GPU_Cluster-blue?style=flat&labelColor=555" alt="No GPU Cluster" />
  <img src="https://img.shields.io/badge/🛠️_Skill_Evolution-orange?style=flat&labelColor=555" alt="Skill Evolution" />
  <img src="https://img.shields.io/badge/🚀_Ein_Klick_Deploy-green?style=flat&labelColor=555" alt="One-Click Deploy" />
</p>

<br/>

[🇺🇸 English](../README.md) • [🇨🇳 中文](./README_ZH.md) • [🇯🇵 日本語](./README_JA.md) • [🇰🇷 한국어](./README_KO.md) • [🇫🇷 Français](./README_FR.md) • [🇪🇸 Español](./README_ES.md)

<br/>

[Überblick](#-überblick) • [Schnellstart](#-schnellstart) • [CLI](#️-cli-referenz) • [Konfiguration](#️-konfiguration) • [Skills](#-skills) • [RL-Modus](#-erweitert-rl-modus) • [Zitierung](#-zitierung)

</div>

---

<div align="center">

### Zwei Befehle. Das war's.

```bash
metaclaw setup              # einmaliger Konfigurationsassistent
metaclaw start              # Standard: Auto-Modus — Skills + geplantes RL-Training
metaclaw start --mode rl    # RL ohne Scheduler (trainiert sofort bei vollem Batch)
metaclaw start --mode skills_only  # Nur Skills, kein RL (kein Tinker nötig)
```

<img src="metaclaw.gif" alt="MetaClaw Demo" width="700">

</div>

---

## 🔥 Neuigkeiten

- **[11.03.2026]** **v0.2** — Ein-Klick-Deployment über das `metaclaw` CLI. Skill-Injektion standardmäßig aktiviert, RL jetzt optional.
- **[09.03.2026]** Offizieller Release von **MetaClaw** — Sprich mit deinem Agenten, er entwickelt sich automatisch weiter. Kein GPU-Cluster erforderlich.

---

## 📖 Überblick

**MetaClaw verwandelt live Gespräche automatisch in kontinuierliche Trainingsdaten — ohne manuellen Aufwand.**
Sprich einfach wie gewohnt mit deinem Agenten, MetaClaw übernimmt den Lernkreislauf im Hintergrund.

Es kapselt dein Modell hinter einem OpenAI-kompatiblen Proxy, fängt Interaktionen über OpenClaw ab, injiziert relevante Skills bei jedem Schritt und fasst nach jeder Session automatisch neue Skills zusammen. Optional kann Tinker Cloud RL aktiviert werden — Gewichte werden hot-geswappt ohne Dienstunterbrechung.

Kein GPU-Cluster nötig. Der `skills_only`-Modus funktioniert mit jeder LLM-API, und RL-Training wird an [Tinker](https://www.thinkingmachines.ai/tinker/) Cloud ausgelagert.

---

## 🚀 Schnellstart

### 1. Installation

```bash
pip install -e .            # skills_only Modus (leichtgewichtig)
pip install -e ".[rl]"      # + RL-Training-Unterstützung
pip install -e ".[evolve]"  # + automatische Skill-Zusammenfassung
```

### 2. Konfiguration

```bash
metaclaw setup
```

Der interaktive Assistent führt dich durch die Auswahl des LLM-Anbieters (Kimi, Qwen oder benutzerdefiniert), API-Schlüssel und optionale RL-Aktivierung.

### 3. Starten

```bash
metaclaw start
```

Das war's. MetaClaw startet den Proxy, konfiguriert OpenClaw automatisch und startet das Gateway neu. Öffne OpenClaw und beginne zu chatten — Skills werden bei jedem Schritt injiziert und nach der Session automatisch zusammengefasst.

---

## 🛠️ CLI-Referenz

```
metaclaw setup              # Einmaliger Konfigurationsassistent
metaclaw start              # MetaClaw starten (Standard: Auto-Modus)
metaclaw start --mode rl    # RL-Modus erzwingen (ohne Scheduler)
metaclaw start --mode skills_only  # Nur-Skills-Modus erzwingen
metaclaw stop               # Laufende MetaClaw-Instanz stoppen
metaclaw status             # Proxy-Status und aktiven Modus prüfen
metaclaw config show        # Aktuelle Konfiguration anzeigen
metaclaw config KEY VALUE   # Konfigurationswert setzen
```

**Häufig verwendete Konfigurationsbefehle:**

```bash
metaclaw config rl.enabled true           # RL-Training aktivieren
metaclaw config rl.tinker_api_key sk-...  # Tinker-Schlüssel setzen
metaclaw config skills.auto_evolve false  # Automatische Zusammenfassung deaktivieren
metaclaw config proxy.port 31000          # Proxy-Port ändern
```

---

## ⚙️ Konfiguration

Die Konfiguration liegt in `~/.metaclaw/config.yaml`, erstellt durch `metaclaw setup`.

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

Skills sind kurze Markdown-Anweisungen, die bei jedem Schritt in den System-Prompt des Agenten injiziert werden. Sie werden in `~/.metaclaw/skills/` als einzelne `SKILL.md`-Dateien gespeichert.

**Automatische Skill-Zusammenfassung** läuft nach jeder Konversation. Das konfigurierte LLM analysiert die Session und generiert neue Skills automatisch. Kein manuelles Kuratieren nötig — die Bibliothek wächst mit der Nutzung.

Eingebaute Skill-Bank (40+ Skills) vorladen:

```bash
cp -r memory_data/skills/* ~/.metaclaw/skills/
```

---

## 🔬 Erweitert: RL-Modus

```bash
metaclaw config rl.enabled true
metaclaw config rl.tinker_api_key sk-...
metaclaw config rl.prm_url https://api.openai.com/v1
metaclaw config rl.prm_api_key sk-...
metaclaw start
```

Im RL-Modus wird jeder Gesprächszug tokenisiert und als Trainingsbeispiel eingereicht. Ein Richter-LLM (PRM) bewertet Antworten asynchron, und Tinker Cloud führt LoRA-Fine-Tuning durch.

---

## 📚 Zitierung

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

## 🙏 Danksagungen

- [OpenClaw](https://openclaw.ai) – das Kern-Agent-Framework
- [SkillRL](https://github.com/aiming-lab/SkillRL) – unser skill-erweitertes RL-Framework
- [Tinker](https://www.thinkingmachines.ai/tinker/) – Cloud-RL-Training
- [OpenClaw-RL](https://github.com/Gen-Verse/OpenClaw-RL) – Inspiration für unser RL-Design
- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) – Grundlage unserer Skill-Bank

---

## 📄 Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](LICENSE).
