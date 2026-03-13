<div align="center">

<img src="logo.jpg" alt="MetaClaw" width="600">

<br/>

### 只需与你的 Agent 对话 —— 它会不断学习，持续进化。

<p>
  <a href="https://github.com/aiming-lab/MetaClaw"><img src="https://img.shields.io/badge/github-MetaClaw-181717?style=flat&labelColor=555&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat&labelColor=555" alt="License MIT"></a>
  <img src="https://img.shields.io/badge/⚡_完全异步-yellow?style=flat&labelColor=555" alt="Fully Async" />
  <img src="https://img.shields.io/badge/☁️_无需_GPU_集群-blue?style=flat&labelColor=555" alt="No GPU Cluster" />
  <img src="https://img.shields.io/badge/🛠️_Skill_进化-orange?style=flat&labelColor=555" alt="Skill Evolution" />
  <img src="https://img.shields.io/badge/🚀_一键部署-green?style=flat&labelColor=555" alt="One-Click Deploy" />
</p>

<br/>

[🇺🇸 English](../README.md) • [🇯🇵 日本語](./README_JA.md) • [🇰🇷 한국어](./README_KO.md) • [🇫🇷 Français](./README_FR.md) • [🇩🇪 Deutsch](./README_DE.md) • [🇪🇸 Español](./README_ES.md)

<br/>

[概述](#-概述) • [快速开始](#-快速开始) • [CLI 命令](#️-cli-命令) • [配置说明](#️-配置说明) • [Skills](#-skills) • [RL 模式](#-进阶rl-模式) • [引用](#-引用)

</div>

---

<div align="center">

### 两条命令，全部搞定。

```bash
metaclaw setup              # 一次性配置向导
metaclaw start              # 默认 auto 模式：Skills + 定时 RL 训练
metaclaw start --mode rl    # 无调度器 RL（batch 满即训练）
metaclaw start --mode skills_only  # 仅 Skills，无 RL（无需 Tinker）
```

<img src="metaclaw.gif" alt="MetaClaw 演示" width="700">

</div>

---

## 🔥 最新动态

- **[2026/03/11]** **v0.2** —— 发布 `metaclaw` CLI，支持一键部署。Skill 注入默认开启，RL 训练改为可选项。
- **[2026/03/09]** 正式发布 **MetaClaw** —— 基于 Tinker 云端 LoRA 的 CLI Agent 在线 RL 训练框架，内置 Skill 注入与自动进化能力。

---

## 🎥 演示视频

https://github.com/user-attachments/assets/1c2919fc-5612-40f7-bb97-c74ab50619d5

---

## 📖 概述

**MetaClaw 在后台对真实对话进行持续训练 —— 无需任何手动操作。**
只需和 Agent 正常对话，MetaClaw 在幕后完成其余一切。

它将你的模型封装为 OpenAI 兼容代理，通过 OpenClaw 拦截实时对话，在每轮对话时注入相关 Skill，并在会话结束后自动总结新 Skill。可选开启 Tinker 云端 RL 持续微调，新权重热更新，无需重启。

无需 GPU 集群。`skills_only` 模式只需一个 LLM API 即可运行；RL 模式通过 [Tinker](https://www.thinkingmachines.ai/tinker/) 在云端完成训练。

## 🤖 核心特性

### **一键部署**
运行 `metaclaw setup` 完成一次配置，之后只需 `metaclaw start` 即可启动代理、注入 Skill、自动配置 OpenClaw，无需手动执行任何 Shell 脚本。

### **三种运行模式**

| 模式 | 默认 | 功能 |
|------|------|------|
| `auto` | ✅ | RL + 智能调度器。Skill 持续注入；RL 权重更新只在睡眠/空闲/会议窗口进行。 |
| `rl` | — | 无调度器 RL。batch 满后立即训练（v0.2 行为）。 |
| `skills_only` | — | 代理 → 你的 LLM API。注入 Skill，自动总结。无需 GPU / Tinker。 |

### **Skill 注入**
每轮对话时自动检索最相关的 Skill 指令注入 system prompt，无需重新训练即可立即改善 Agent 行为。

### **Skill 自动总结**
每次会话结束后，使用你已配置的 LLM 自动分析对话内容，提炼新 Skill 并写入技能库。开启 RL 模式时，还会用专门的 judge 模型从失败的 episode 中提取教训。

### **无需 GPU 集群**
`skills_only` 模式只需网络连接。RL 训练完全在 Tinker 云端运行。

### **两种学习模式**
MetaClaw 同时支持：
- **RL（GRPO）** 用于隐式反馈信号
- **On-Policy Distillation（OPD）** 用于将更大的教师模型蒸馏到学生模型

OPD 模式下，学生模型正常生成回复，教师模型对相同回复提供逐 token 的 log-probability，传入损失函数（如 `cispo`）使学生逐步逼近教师分布。教师模型需部署在 OpenAI 兼容的 `/v1/completions` 端点（如 vLLM、SGLang）。

### **完全异步**
推理服务、奖励打分、模型训练完全解耦。Agent 持续响应，学习在后台进行。

---

## 🚀 快速开始

### 1. 安装

```bash
pip install -e .            # skills_only 模式（轻量）
pip install -e ".[rl]"      # + RL 训练支持（torch、transformers、tinker）
pip install -e ".[evolve]"  # + 通过 OpenAI 兼容接口进行 Skill 进化
```

### 2. 配置

```bash
metaclaw setup
```

交互式向导会引导你选择 LLM 提供商（Kimi、Qwen 或自定义），填写 API Key，并可选开启 RL 训练。

### 3. 启动

```bash
metaclaw start
```

完成。MetaClaw 启动代理、自动配置 OpenClaw 并重启网关。打开 OpenClaw 正常对话即可 —— Skill 在每轮自动注入，会话结束后自动总结成新 Skill。

---

## 🛠️ CLI 命令

```
metaclaw setup              # 交互式首次配置向导
metaclaw start              # 启动 MetaClaw（默认 auto 模式）
metaclaw start --mode rl    # 本次会话强制 RL 模式（无调度器）
metaclaw start --mode skills_only  # 本次会话强制仅 Skills 模式
metaclaw stop               # 停止运行中的 MetaClaw
metaclaw status             # 查看代理健康状态和运行模式
metaclaw config show        # 查看当前完整配置
metaclaw config KEY VALUE   # 设置配置项
```

**常用配置命令：**

```bash
metaclaw config rl.enabled true           # 开启 RL 训练
metaclaw config rl.tinker_api_key sk-...  # 设置 Tinker Key
metaclaw config skills.auto_evolve false  # 关闭 Skill 自动总结
metaclaw config proxy.port 31000          # 修改代理端口
```

---

## ⚙️ 配置说明

配置存储在 `~/.metaclaw/config.yaml`，由 `metaclaw setup` 创建。

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
  dir: ~/.metaclaw/skills   # 你的 Skill 库目录
  retrieval_mode: template  # template | embedding
  top_k: 6
  task_specific_top_k: 10   # task-specific skills 上限（默认 10）
  auto_evolve: true         # 会话结束后自动总结 Skill

rl:
  enabled: false            # 设为 true 开启 RL 训练
  model: moonshotai/Kimi-K2.5
  tinker_api_key: ""
  prm_url: https://api.openai.com/v1
  prm_model: gpt-5.2
  prm_api_key: ""
  lora_rank: 32
  batch_size: 4
  resume_from_ckpt: ""      # 可选：从 checkpoint 恢复训练
  evolver_api_base: ""      # 留空则复用 llm.api_base
  evolver_api_key: ""
  evolver_model: gpt-5.2

opd:
  enabled: false            # 设为 true 开启 OPD（教师蒸馏）
  teacher_url: ""           # 教师模型 base URL（OpenAI 兼容 /v1/completions）
  teacher_model: ""         # 教师模型名称（如 Qwen/Qwen3-32B）
  teacher_api_key: ""       # 教师模型 API key
  kl_penalty_coef: 1.0      # OPD 的 KL 惩罚系数

max_context_tokens: 20000   # 截断前的 prompt token 上限
```

---

## 💪 Skills

Skill 是注入 Agent system prompt 的简短 Markdown 指令，存储在你的 Skill 库目录（默认 `~/.metaclaw/skills/`）。

**Skill 自动总结**在每次会话结束后自动运行。已配置的 LLM 会分析本次对话内容并生成新 Skill，技能库随使用自动增长，无需手动维护。

预加载内置 Skill 库（40+ 条，涵盖 coding、security、agentic 等类别）：

```bash
cp -r memory_data/skills/* ~/.metaclaw/skills/
```

---

## 🔬 进阶：RL 模式

开启 RL 训练，从真实对话中持续微调模型：

```bash
metaclaw config rl.enabled true
metaclaw config rl.tinker_api_key sk-...
metaclaw config rl.prm_url https://api.openai.com/v1
metaclaw config rl.prm_api_key sk-...
metaclaw start
```

RL 模式下：
- 每轮对话被 tokenize 并作为训练样本提交
- Judge LLM（PRM）异步对响应质量打分
- Tinker 云端执行 LoRA 微调，每累积 `batch_size` 个样本热更新权重
- 专用 evolver 模型从失败的 episode 中提炼新 Skill

**程序化 Rollout**（无需 OpenClaw TUI）：将 `openclaw_env_data_dir` 指向一个 JSONL 任务文件目录：

```json
{"task_id": "task_1", "instruction": "在 https://example.com/hook 注册 webhook"}
```

---

## 🔬 进阶：OPD 模式

On-Policy Distillation（OPD）允许将更大的教师模型蒸馏到学生模型中。学生模型正常生成回复，教师模型对相同回复提供逐 token 的 log-probability。KL 惩罚引导学生逼近教师分布。

```bash
metaclaw config opd.enabled true
metaclaw config opd.teacher_url http://localhost:8082/v1
metaclaw config opd.teacher_model Qwen/Qwen3-32B
metaclaw config opd.kl_penalty_coef 1.0
metaclaw start --mode rl
```

教师模型需部署在 OpenAI 兼容的 `/v1/completions` 端点（如 vLLM、SGLang）。OPD 可与 PRM 打分同时使用，两者均异步运行。

参考 `examples/run_conversation_opd.py` 获取编程示例，或使用 `scripts/run_openclaw_tinker_opd.sh` 快速启动。

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

## 🙏 致谢

MetaClaw 基于以下开源项目构建：

- [OpenClaw](https://openclaw.ai) – 核心 Agent 框架。
- [SkillRL](https://github.com/aiming-lab/SkillRL) – Skill 增强 RL 框架。
- [Tinker](https://www.thinkingmachines.ai/tinker/) – 云端在线 RL 训练。
- [OpenClaw-RL](https://github.com/Gen-Verse/OpenClaw-RL) – RL 设计参考。
- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) – Skill 库基础。

---

## 📄 许可证

本项目基于 [MIT License](LICENSE)。
