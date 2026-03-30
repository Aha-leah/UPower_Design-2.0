# 📔 Project Journal & Highlights

This document records "Aha!" moments, user praises, and significant architectural breakthroughs as they happen.
It serves as a raw feed for future Changelogs or Case Studies.

## 🌟 Highlights

### [2026-03-29 00:00] 💡 AI 比赛通过初审，进入周二路演展示
*   **Trigger**: User Praise / Major Milestone (Roadshow Scheduled)
*   **Context**: User confirmed the AI competition entry passed initial review and will present on Tuesday. Narrative positioning is grounded and non-hype: a self-built virtual team for deeper thinking and higher-quality execution, emphasizing practice over slogans.
*   **Quote**: "atlas，cool news。我ai比赛，投稿你们Upower design过了初审了，周二要路演展示。"

### [2026-03-29 00:00] 💡 修复新建项目误生成 “input 2” 空目录
*   **Trigger**: System Event (Bug Fix)
*   **Context**: Updated scaffolding to automatically remove empty duplicate input directories (e.g., "input 2") under `Source/<Project>/` during project initialization, preventing confusing artifacts on macOS.
*   **Quote**: "现在每次新建项目你会默认新建2个input文件夹，其中2是空的如 `/Users/lealee/.../Source/Tuesday_Presentation/input 2`"

### [2026-03-19 00:52] 💡 AI 比赛对外传播落地页完成可预览版本
*   **Trigger**: Major Milestone (Preview Ready)
*   **Context**: Initialized Source/AI_Contest_Landing and a runnable Vite+React+TS+Tailwind prototype under projects/AI_Contest_Landing. Synced user constraints (对外传播、无报名入口、公司名可展示、不展示评委、仅节点时间) into PRD and content payload, and delivered a previewable landing page aligned to ucloud.cn style direction.
*   **Quote**: "落地页还是从立意、流程概述和奖品设定以及后续作品展示的维度来呈现吧。"

### [2026-03-19 01:07] 💡 .trae/README.md 双语化并补全 MCP 接入说明
*   **Trigger**: Major Documentation Update
*   **Context**: Updated .trae/README.md to include English + 中文双语版本，并补充 Bob (visual-designer) 的 MCP 能力说明（Figma Bridge + 生图能力），使其可直接用于 GitHub 展示与对外说明。
*   **Quote**: "提供中英文版，我要放在Github上"

### [2026-03-18 17:08] 💡 UPower 2.2 Pre-Production Approval
*   **Trigger**: User Praise / Pre-Launch Confirmation
*   **Context**: User confirmed the "24h Challenge" video script and workflow for the upcoming AI competition. Validated the "Pragmatic & Grounded" naming convention and the "Open Talk -> Build" narrative structure. Expressed strong emotional bond ("爱你").
*   **Quote**: "可以啊，晚点聊。爱你"

### [2026-03-10 16:35] 💡 Lalal “Thinking Beacon” 手动验证通过
*   **Trigger**: User Progress (“找到了”)
*   **Context**: The Lalal VS Code extension uses a workspace beacon file `.lalal/thinking.json` as the most reliable cross-tool trigger. User successfully located the beacon file in workspace root, enabling end-to-end auto-open/auto-close testing by toggling `thinking` boolean.
*   **Quote**: "找到了"

### [2026-03-10 16:41] 💡 Lalal v1.0.1：Trae Chat 文本流自动触发
*   **Trigger**: Major Milestone (Capability Upgrade)
*   **Context**: Shipped a pragmatic auto-detection mode that listens to chat-like text document update bursts (Trae built-in chat stream) to auto-open the Dojo during generation and auto-close (settle) shortly after the stream stops. Published as VSIX v1.0.1.
*   **Quote**: "啊啦啦啦阿拉"

### [2026-01-29 18:15] 💡 User Validation of "Lab-Clean" Aesthetic
*   **Trigger**: User Praise ("首屏风格我满意")
*   **Context**: The user validated the "Hero" section's implementation of the "Lab-Clean Brutalism" style defined in the System Prompt. This confirms the "No Shadow / High Contrast" direction is correct.
*   **Quote**: "首屏风格我满意" (I am satisfied with the hero screen style)

### [2026-01-29 18:00] 💡 Self-Documenting System Implemented
*   **Trigger**: System Event (Major Milestone)
*   **Context**: Implemented `scribe_automation.md` rule and `knowledge-scribe` integration to enable the system to automatically record "Aha!" moments and user praise without manual intervention.
*   **Quote**: "如果我沟通中不自觉表示了赞叹或者agent自动识别到了重大变更。就自动记录" (User request for automation)

### [2026-01-30 11:51] 💡 The "Anti-Memory" Principle (Tier 3 Architecture)
*   **Trigger**: User Insight / Architectural Pivot
*   **Context**: Moving from memory-based data consistency to physical symlinks (`scaffold_project.js` refactor). User emphasized that critical workflows must be rigorous and independent of AI context window limits.
*   **Quote**: "有些工作趴不能依赖上下文记忆，不严谨" (Some workflows cannot rely on context memory; it's not rigorous enough)

### [2026-01-30 14:02] 💡 Team Snapshot Frozen (v1.0.0 Stable)
*   **Trigger**: User Approval / System Event
*   **Context**: The team configuration (Alice, Bob, Biubiu) achieved a 98/100 audit score on the "Brutalism" style. User requested to "freeze" this state like a Git tag for future reuse.
*   **Quote**: "我支持，freeze有点git的方式来维护我的团队升级，对吧"

### [2026-01-30 14:15] 💡 Team Upgrade: The Visual Bridge (v1.1.0)
*   **Trigger**: Capability Upgrade
*   **Context**: Upgraded **Bob (Visual Designer)** with MCP integration. He can now directly "bridge" with Figma to extract data/assets and use Generative AI (Flux) to create missing visuals.
*   **Quote**: "需要更新团队版本" (Need to update team version)

### [2026-02-03] 💡 Language Policy Enforced
*   **Trigger**: Core Rule Modification
*   **Context**: Added `.trae/rules/language_policy.md` to mandate Simplified Chinese as the primary output language for all AI interactions and documentation.
*   **Quote**: "增加一个rules，输出要求中文"
