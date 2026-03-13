<div align="center">

<img src="logo.jpg" alt="MetaClaw" width="600">

<br/>

### エージェントと話すだけ —— 自動で学習し、進化し続ける。

<p>
  <a href="https://github.com/aiming-lab/MetaClaw"><img src="https://img.shields.io/badge/github-MetaClaw-181717?style=flat&labelColor=555&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat&labelColor=555" alt="License MIT"></a>
  <img src="https://img.shields.io/badge/⚡_完全非同期-yellow?style=flat&labelColor=555" alt="Fully Async" />
  <img src="https://img.shields.io/badge/☁️_GPUクラスタ不要-blue?style=flat&labelColor=555" alt="No GPU Cluster" />
  <img src="https://img.shields.io/badge/🛠️_スキル進化-orange?style=flat&labelColor=555" alt="Skill Evolution" />
  <img src="https://img.shields.io/badge/🚀_ワンクリックデプロイ-green?style=flat&labelColor=555" alt="One-Click Deploy" />
</p>

<br/>

[🇺🇸 English](../README.md) • [🇨🇳 中文](./README_ZH.md) • [🇰🇷 한국어](./README_KO.md) • [🇫🇷 Français](./README_FR.md) • [🇩🇪 Deutsch](./README_DE.md) • [🇪🇸 Español](./README_ES.md)

<br/>

[概要](#-概要) • [クイックスタート](#-クイックスタート) • [CLI リファレンス](#️-cli-リファレンス) • [設定](#️-設定) • [スキル](#-スキル) • [RL モード](#-高度な設定rl-モード) • [引用](#-引用)

</div>

---

<div align="center">

### コマンド 2 つで完了。

```bash
metaclaw setup              # 初回設定ウィザード
metaclaw start              # デフォルト: auto モード — スキル + スケジュール RL トレーニング
metaclaw start --mode rl    # スケジューラなし RL（バッチが満たされ次第即時トレーニング）
metaclaw start --mode skills_only  # スキルのみ、RL なし（Tinker 不要）
```

<img src="metaclaw.gif" alt="MetaClaw デモ" width="700">

</div>

---

## 🔥 ニュース

- **[2026/03/11]** **v0.2** — `metaclaw` CLI によるワンクリックデプロイ。スキル注入がデフォルト有効化、RL はオプション化。
- **[2026/03/09]** **MetaClaw** 正式リリース — エージェントと話すだけで自動進化。GPU クラスタ不要。

---

## 📖 概要

**MetaClaw はバックグラウンドでリアルな会話を継続的なトレーニングデータに変換します —— 手動操作は一切不要。**
いつも通りエージェントと話すだけで、MetaClaw が学習ループをすべて処理します。

モデルを OpenAI 互換プロキシでラップし、OpenClaw 経由でインタラクションをインターセプト。各ターンで関連スキルを注入し、セッション終了後に新しいスキルを自動集約します。オプションで Tinker クラウド RL を有効化することで、ウェイトのホットスワップが可能です（サービス中断なし）。

GPU クラスタは不要です。`skills_only` モードは LLM API だけで動作し、RL トレーニングは [Tinker](https://www.thinkingmachines.ai/tinker/) クラウドにオフロードされます。

---

## 🚀 クイックスタート

### 1. インストール

```bash
pip install -e .            # skills_only モード（軽量）
pip install -e ".[rl]"      # + RL トレーニングサポート
pip install -e ".[evolve]"  # + スキル自動集約
```

### 2. 設定

```bash
metaclaw setup
```

対話型ウィザードで LLM プロバイダー（Kimi、Qwen、またはカスタム）、API キー、RL の有効化を設定します。

### 3. 起動

```bash
metaclaw start
```

以上です。MetaClaw がプロキシを起動し、OpenClaw を自動設定します。OpenClaw を開いてチャットするだけで、スキルが各ターンに注入され、セッション終了後に自動集約されます。

---

## 🛠️ CLI リファレンス

```
metaclaw setup              # 初回設定ウィザード
metaclaw start              # MetaClaw 起動（デフォルト: auto モード）
metaclaw start --mode rl    # このセッションを RL モードで強制起動（スケジューラなし）
metaclaw start --mode skills_only  # このセッションをスキルのみモードで起動
metaclaw stop               # 実行中の MetaClaw を停止
metaclaw status             # プロキシの状態と実行モードを確認
metaclaw config show        # 現在の設定を表示
metaclaw config KEY VALUE   # 設定値を変更
```

**よく使う設定コマンド：**

```bash
metaclaw config rl.enabled true           # RL トレーニングを有効化
metaclaw config rl.tinker_api_key sk-...  # Tinker キーを設定
metaclaw config skills.auto_evolve false  # スキル自動集約を無効化
metaclaw config proxy.port 31000          # プロキシポートを変更
```

---

## ⚙️ 設定

設定は `~/.metaclaw/config.yaml` に保存されます（`metaclaw setup` で生成）。

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

## 💪 スキル

スキルは各ターンのシステムプロンプトに注入される短い Markdown 指示です。`~/.metaclaw/skills/` に個別の `SKILL.md` ファイルとして保存されます。

**スキル自動集約**はセッションごとに実行されます。設定済みの LLM が会話を分析し、新しいスキルを自動生成します。手動メンテナンスは不要 —— ライブラリは使用とともに成長します。

組み込みスキルバンク（40+ スキル）をプリロードするには：

```bash
cp -r memory_data/skills/* ~/.metaclaw/skills/
```

---

## 🔬 高度な設定：RL モード

```bash
metaclaw config rl.enabled true
metaclaw config rl.tinker_api_key sk-...
metaclaw config rl.prm_url https://api.openai.com/v1
metaclaw config rl.prm_api_key sk-...
metaclaw start
```

RL モードでは、各会話ターンがトークン化されてトレーニングサンプルとして送信され、PRM が非同期でスコアリングし、Tinker クラウドが LoRA ファインチューニングを実行します。

---

## 📚 引用

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

## 🙏 謝辞

- [OpenClaw](https://openclaw.ai) – コアエージェントフレームワーク
- [SkillRL](https://github.com/aiming-lab/SkillRL) – スキル拡張 RL フレームワーク
- [Tinker](https://www.thinkingmachines.ai/tinker/) – クラウド RL トレーニング
- [OpenClaw-RL](https://github.com/Gen-Verse/OpenClaw-RL) – RL 設計の参考
- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) – スキルバンクの基盤

---

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) の下でライセンスされています。
