<div align="center">

<img src="logo.jpg" alt="MetaClaw" width="600">

<br/>

### Parlez à votre agent — il apprend et *ÉVOLUE*.

<p>
  <a href="https://github.com/aiming-lab/MetaClaw"><img src="https://img.shields.io/badge/github-MetaClaw-181717?style=flat&labelColor=555&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat&labelColor=555" alt="License MIT"></a>
  <img src="https://img.shields.io/badge/⚡_Entièrement_Async-yellow?style=flat&labelColor=555" alt="Fully Async" />
  <img src="https://img.shields.io/badge/☁️_Sans_Cluster_GPU-blue?style=flat&labelColor=555" alt="No GPU Cluster" />
  <img src="https://img.shields.io/badge/🛠️_Évolution_des_Skills-orange?style=flat&labelColor=555" alt="Skill Evolution" />
  <img src="https://img.shields.io/badge/🚀_Déploiement_en_1_clic-green?style=flat&labelColor=555" alt="One-Click Deploy" />
</p>

<br/>

[🇺🇸 English](../README.md) • [🇨🇳 中文](./README_ZH.md) • [🇯🇵 日本語](./README_JA.md) • [🇰🇷 한국어](./README_KO.md) • [🇩🇪 Deutsch](./README_DE.md) • [🇪🇸 Español](./README_ES.md)

<br/>

[Aperçu](#-aperçu) • [Démarrage rapide](#-démarrage-rapide) • [CLI](#️-référence-cli) • [Configuration](#️-configuration) • [Skills](#-skills) • [Mode RL](#-avancé-mode-rl) • [Citation](#-citation)

</div>

---

<div align="center">

### Deux commandes. C'est tout.

```bash
metaclaw setup              # assistant de configuration initial
metaclaw start              # par défaut : mode auto — skills + entraînement RL planifié
metaclaw start --mode rl    # RL sans planificateur (entraîne dès qu'un batch est plein)
metaclaw start --mode skills_only  # skills uniquement, pas de RL (Tinker non requis)
```

<img src="metaclaw.gif" alt="Démo MetaClaw" width="700">

</div>

---

## 🔥 Nouveautés

- **[11/03/2026]** **v0.2** — Déploiement en un clic via le CLI `metaclaw`. Injection de skills activée par défaut, RL désormais optionnel.
- **[09/03/2026]** Lancement officiel de **MetaClaw** — Parlez à votre agent, il évolue automatiquement. Aucun cluster GPU requis.

---

## 📖 Aperçu

**MetaClaw transforme vos conversations en données d'entraînement continues — automatiquement.**
Parlez à votre agent comme d'habitude, MetaClaw gère la boucle d'apprentissage en arrière-plan.

Il encapsule votre modèle derrière un proxy compatible OpenAI, intercepte les interactions via OpenClaw, injecte les skills pertinents à chaque tour, et résume automatiquement de nouveaux skills après chaque session. Activez optionnellement le RL cloud Tinker pour un fine-tuning continu avec hot-swap des poids.

Aucun cluster GPU nécessaire. Le mode `skills_only` fonctionne avec n'importe quelle API LLM, et le mode RL délègue l'entraînement à [Tinker](https://www.thinkingmachines.ai/tinker/) dans le cloud.

---

## 🚀 Démarrage rapide

### 1. Installation

```bash
pip install -e .            # mode skills_only (léger)
pip install -e ".[rl]"      # + support entraînement RL
pip install -e ".[evolve]"  # + résumé automatique des skills
```

### 2. Configuration

```bash
metaclaw setup
```

L'assistant interactif vous demande de choisir votre fournisseur LLM (Kimi, Qwen, ou personnalisé), votre clé API, et d'activer optionnellement l'entraînement RL.

### 3. Démarrage

```bash
metaclaw start
```

C'est tout. MetaClaw démarre le proxy, configure automatiquement OpenClaw et redémarre la passerelle. Ouvrez OpenClaw et commencez à discuter — les skills sont injectés à chaque tour et résumés en nouveaux skills à la fin de la session.

---

## 🛠️ Référence CLI

```
metaclaw setup              # Assistant de configuration initial
metaclaw start              # Démarrer MetaClaw (par défaut : mode auto)
metaclaw start --mode rl    # Forcer le mode RL (sans planificateur) pour cette session
metaclaw start --mode skills_only  # Forcer le mode skills uniquement
metaclaw stop               # Arrêter une instance MetaClaw en cours
metaclaw status             # Vérifier l'état du proxy et le mode actif
metaclaw config show        # Afficher la configuration actuelle
metaclaw config KEY VALUE   # Modifier une valeur de configuration
```

**Commandes de configuration courantes :**

```bash
metaclaw config rl.enabled true           # Activer l'entraînement RL
metaclaw config rl.tinker_api_key sk-...  # Définir la clé Tinker
metaclaw config skills.auto_evolve false  # Désactiver le résumé automatique
metaclaw config proxy.port 31000          # Changer le port du proxy
```

---

## ⚙️ Configuration

La configuration est stockée dans `~/.metaclaw/config.yaml`, créé par `metaclaw setup`.

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

Les skills sont de courtes instructions Markdown injectées dans le system prompt de l'agent à chaque tour. Elles sont stockées dans `~/.metaclaw/skills/` sous forme de fichiers `SKILL.md` individuels.

**Le résumé automatique des skills** s'exécute après chaque conversation. Le LLM configuré analyse la session et génère de nouveaux skills automatiquement. Aucune curation manuelle nécessaire — la bibliothèque grandit avec l'usage.

Pour pré-charger la banque de skills intégrée (40+ skills) :

```bash
cp -r memory_data/skills/* ~/.metaclaw/skills/
```

---

## 🔬 Avancé : Mode RL

```bash
metaclaw config rl.enabled true
metaclaw config rl.tinker_api_key sk-...
metaclaw config rl.prm_url https://api.openai.com/v1
metaclaw config rl.prm_api_key sk-...
metaclaw start
```

En mode RL, chaque tour de conversation est tokenisé et soumis comme échantillon d'entraînement. Un LLM juge (PRM) évalue les réponses de manière asynchrone, et Tinker exécute le fine-tuning LoRA dans le cloud.

---

## 📚 Citation

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

## 🙏 Remerciements

- [OpenClaw](https://openclaw.ai) – le framework agent principal
- [SkillRL](https://github.com/aiming-lab/SkillRL) – notre framework RL augmenté de skills
- [Tinker](https://www.thinkingmachines.ai/tinker/) – entraînement RL en ligne dans le cloud
- [OpenClaw-RL](https://github.com/Gen-Verse/OpenClaw-RL) – inspiration pour notre conception RL
- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) – base de notre banque de skills

---

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).
