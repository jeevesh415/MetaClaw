# MetaClaw Benchmark

Evaluation suite for the MetaClaw Evolution Benchmark — measures how well AI agents learn and adapt from multi-day interaction histories.

## Quick Start

```bash
# Install (requires Python ≥ 3.10)
cd benchmark
pip install -e .

# Validate dataset
metaclaw-bench check data/metaclaw-bench/all_tests.json

# Use pre-built script
python scripts/dummy_run.py

# Manually run full pipeline (infer → score → report)
metaclaw start  # start metaclaw proxy first
export BENCHMARK_BASE_URL=http://127.0.0.1:30000/v1
export BENCHMARK_MODEL=GPT-5.2
metaclaw-bench run data/metaclaw-bench/all_tests.json --output results/
```

## Project Structure

```
benchmark/
├── data/
│   ├── metaclaw-bench/          # Full benchmark (30 days)
│   └── metaclaw-bench-small/    # Small subset (12 days)
├── docs/
│   └── CLI.md                   # CLI reference
├── scripts/                     # Experiment runner scripts
│   └── config/                  # YAML configs for different strategies
├── src/                         # Core library
│   ├── cli.py                   # Entry point
│   ├── check/                   # Dataset validation
│   ├── infer/                   # Agent inference
│   ├── scoring/                 # Result scoring
│   ├── report/                  # Report generation
│   ├── run/                     # Full pipeline orchestration
│   └── clean/                   # Workspace cleanup
├── tests/                       # Unit tests
└── openclaw_customize/          # OpenClaw plugin extensions
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `check` | Validate dataset integrity (8 checks) |
| `infer` | Run agent inference on scenarios |
| `score` | Score inference results |
| `report`| Generate summary report |
| `run`   | Full pipeline: infer → score → report |
| `clean` | Remove temporary work directories |

See [docs/CLI.md](docs/CLI.md) for detailed usage and options.

## Experiment Scripts

Pre-built runner scripts under `scripts/` support various agent strategies:

- **baseline** — vanilla agent without enhancements
- **memory / skills-memory** — agents with memory modules
- **rl / rl-only** — reinforcement-learning-based agents
- **madmax** — combined strategy

Each script reads a YAML config from `scripts/config/`. See `scripts/config/env_arg_example.sh` for environment setup.

## Development

```bash
pip install -e ".[dev]"
pytest -v tests/
```
