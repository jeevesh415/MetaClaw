<div align="center">

<img src="logo.jpg" alt="MetaClaw" width="600">

<br/>

### 에이전트와 대화하세요 —— 스스로 학습하고 진화합니다.

<p>
  <a href="https://github.com/aiming-lab/MetaClaw"><img src="https://img.shields.io/badge/github-MetaClaw-181717?style=flat&labelColor=555&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat&labelColor=555" alt="License MIT"></a>
  <img src="https://img.shields.io/badge/⚡_완전_비동기-yellow?style=flat&labelColor=555" alt="Fully Async" />
  <img src="https://img.shields.io/badge/☁️_GPU_클러스터_불필요-blue?style=flat&labelColor=555" alt="No GPU Cluster" />
  <img src="https://img.shields.io/badge/🛠️_스킬_진화-orange?style=flat&labelColor=555" alt="Skill Evolution" />
  <img src="https://img.shields.io/badge/🚀_원클릭_배포-green?style=flat&labelColor=555" alt="One-Click Deploy" />
</p>

<br/>

[🇺🇸 English](../README.md) • [🇨🇳 中文](./README_ZH.md) • [🇯🇵 日本語](./README_JA.md) • [🇫🇷 Français](./README_FR.md) • [🇩🇪 Deutsch](./README_DE.md) • [🇪🇸 Español](./README_ES.md)

<br/>

[개요](#-개요) • [빠른 시작](#-빠른-시작) • [CLI 레퍼런스](#️-cli-레퍼런스) • [설정](#️-설정) • [스킬](#-스킬) • [RL 모드](#-고급-rl-모드) • [인용](#-인용)

</div>

---

<div align="center">

### 명령어 두 개면 끝.

```bash
metaclaw setup              # 최초 설정 마법사
metaclaw start              # 기본: auto 모드 — 스킬 + 예약된 RL 학습
metaclaw start --mode rl    # 스케줄러 없는 RL (배치가 차면 즉시 학습)
metaclaw start --mode skills_only  # 스킬만, RL 없음 (Tinker 불필요)
```

<img src="metaclaw.gif" alt="MetaClaw 데모" width="700">

</div>

---

## 🔥 최신 소식

- **[2026/03/11]** **v0.2** — `metaclaw` CLI를 통한 원클릭 배포. 스킬 주입 기본 활성화, RL은 선택 사항으로 변경.
- **[2026/03/09]** **MetaClaw** 공식 출시 — 에이전트와 대화하기만 하면 자동으로 진화. GPU 클러스터 불필요.

---

## 📖 개요

**MetaClaw는 실제 대화를 백그라운드에서 지속적인 학습 데이터로 변환합니다 —— 수동 작업 없이.**
평소처럼 에이전트와 대화하기만 하면, MetaClaw가 학습 루프를 자동으로 처리합니다.

모델을 OpenAI 호환 프록시로 감싸고, OpenClaw를 통해 인터랙션을 인터셉트하며, 매 턴마다 관련 스킬을 주입하고, 세션 종료 후 새로운 스킬을 자동 요약합니다. 선택적으로 Tinker 클라우드 RL을 활성화하면 서비스 중단 없이 가중치를 핫스왑할 수 있습니다.

GPU 클러스터가 필요 없습니다. `skills_only` 모드는 LLM API만으로 동작하며, RL 학습은 [Tinker](https://www.thinkingmachines.ai/tinker/) 클라우드에 오프로드됩니다.

---

## 🚀 빠른 시작

### 1. 설치

```bash
pip install -e .            # skills_only 모드 (경량)
pip install -e ".[rl]"      # + RL 학습 지원
pip install -e ".[evolve]"  # + 스킬 자동 요약
```

### 2. 설정

```bash
metaclaw setup
```

대화형 마법사에서 LLM 공급자(Kimi, Qwen, 또는 커스텀), API 키, RL 활성화 여부를 설정합니다.

### 3. 시작

```bash
metaclaw start
```

끝입니다. MetaClaw가 프록시를 시작하고 OpenClaw를 자동으로 설정합니다. OpenClaw를 열고 대화를 시작하면 됩니다 —— 매 턴마다 스킬이 자동 주입되고, 세션 종료 후 새로운 스킬로 자동 요약됩니다.

---

## 🛠️ CLI 레퍼런스

```
metaclaw setup              # 최초 설정 마법사
metaclaw start              # MetaClaw 시작 (기본: auto 모드)
metaclaw start --mode rl    # 이 세션을 RL 모드로 강제 실행 (스케줄러 없음)
metaclaw start --mode skills_only  # 이 세션을 스킬 전용 모드로 실행
metaclaw stop               # 실행 중인 MetaClaw 중지
metaclaw status             # 프록시 상태 및 실행 모드 확인
metaclaw config show        # 현재 전체 설정 보기
metaclaw config KEY VALUE   # 설정값 변경
```

**자주 쓰는 설정 명령:**

```bash
metaclaw config rl.enabled true           # RL 학습 활성화
metaclaw config rl.tinker_api_key sk-...  # Tinker 키 설정
metaclaw config skills.auto_evolve false  # 스킬 자동 요약 비활성화
metaclaw config proxy.port 31000          # 프록시 포트 변경
```

---

## ⚙️ 설정

설정은 `~/.metaclaw/config.yaml`에 저장되며 `metaclaw setup`으로 생성됩니다.

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

## 💪 스킬

스킬은 매 턴마다 에이전트 시스템 프롬프트에 주입되는 짧은 Markdown 지침입니다. `~/.metaclaw/skills/` 디렉토리에 개별 `SKILL.md` 파일로 저장됩니다.

**스킬 자동 요약**은 세션마다 실행됩니다. 설정된 LLM이 대화를 분석하고 새로운 스킬을 자동으로 생성합니다. 수동 관리 불필요 —— 라이브러리는 사용과 함께 성장합니다.

내장 스킬 뱅크(40+ 스킬) 사전 로드:

```bash
cp -r memory_data/skills/* ~/.metaclaw/skills/
```

---

## 🔬 고급: RL 모드

```bash
metaclaw config rl.enabled true
metaclaw config rl.tinker_api_key sk-...
metaclaw config rl.prm_url https://api.openai.com/v1
metaclaw config rl.prm_api_key sk-...
metaclaw start
```

RL 모드에서는 각 대화 턴이 토크나이즈되어 학습 샘플로 제출되고, PRM이 비동기로 점수를 매기며, Tinker 클라우드가 LoRA 파인튜닝을 실행합니다.

---

## 📚 인용

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

## 🙏 감사의 말

- [OpenClaw](https://openclaw.ai) – 핵심 에이전트 프레임워크
- [SkillRL](https://github.com/aiming-lab/SkillRL) – 스킬 증강 RL 프레임워크
- [Tinker](https://www.thinkingmachines.ai/tinker/) – 클라우드 온라인 RL 학습
- [OpenClaw-RL](https://github.com/Gen-Verse/OpenClaw-RL) – RL 설계 참고
- [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) – 스킬 뱅크 기반

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.
