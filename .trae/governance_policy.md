# Team Governance Policy (v3.3)

> "Treat your Prompt Engineering like Software Engineering."

This document defines the protocols for managing the evolution of the UPower Virtual Team.
Any change to `.trae/skills/` or `.trae/rules/` constitutes a **Team Version Upgrade** and must follow this governance model.

---

## 1. Version Control Strategy

We use **Semantic Versioning (SemVer)** for Team Configurations:

| 变更类型 | 示例 | 要求 |
|---|---|---|
| **Major** (v3.0 → v4.0) | 范式转变（换框架、换工作流） | 全量回归测试 + 所有 Skill 重审 |
| **Minor** (v3.1 → v3.2) | 新增功能（双区改造、创意评分） | skill-creator 审核 + Sandbox 验证 |
| **Patch** (v3.2.0 → v3.2.1) | 小调整（修改 Stop Condition 话术、修 typo） | 快速核查（User Audit） |

---

## 2. Skill 修改协议

### 2.1 强制要求

**所有涉及 Skill 修改的工作，必须按以下流程执行：**

```
1. 执行者完成 Skill 草稿
2. 调用 skill-creator 进行质量审核（五维度：D1-D5）
3. skill-creator 输出 APPROVE / CONDITIONAL APPROVE / REJECT
4. 修复所有问题
5. 用户确认后标记完成，记录在 version_plan
```

**不经 skill-creator 审核的 Skill 修改不得合并。**

### 2.2 双区格式规范

所有 Skill 必须遵守 `[STRUCTURE] / [CREATIVE]` 双区格式。

详见：`.trae/knowledgebase/kb_skill_rewrite_spec.md`

### 2.3 审核记录

每次审核结果记录在对应版本的 `version_plan.md`：
```
- [x] B1（Alice）改造 product-designer Skill ✅ skill-creator 审核通过 YYYY-MM-DD
```

---

## 3. Rules 修改协议

`.trae/rules/` 下的文件变更流程：

```
1. 确认修改必要性（不是 Skill 层可以解决的才动 Rules）
2. 提出修改建议，说明原因
3. 相关角色会签（如修改 reviewer_integration.md 需 Judge 确认）
4. 更新文件，记录版本号和日期
5. 通知全体成员
```

---

## 4. Red Lines（不可协商的硬约束）

以下规则为宪法级别，需 Atlas 显式决策才能修改：

1. **技术栈**：React + Tailwind + TypeScript（见 `rules/frontend_red_lines.md`）
2. **工作流**：6 阶段流程 Init → Define → Design → Assemble → Build → Audit
3. **语言**：对话用中文简体，代码用英文
4. **Token 控制**：单 Skill 总体 < 500 行，[STRUCTURE] ≤ 200 tokens

---

## 5. Disaster Recovery

如新版本导致 Agent 行为异常：

```bash
# 回滚到上一个稳定快照
cp -r .trae/snapshots/v{XX}_stable/ .trae/skills/
cp -r .trae/snapshots/v{XX}_stable/ .trae/rules/
```

快照位置：`.trae/snapshots/`（每个 Minor 版本完成后创建）

---

## 6. 当前版本状态

| 组件 | 版本 | 状态 |
|---|---|---|
| product-designer (Alice) | v3.2 | ✅ 双区改造完成 |
| visual-designer (Bob) | v3.2 | ✅ 双区改造完成 |
| ux-architect (Mia) | v3.2 | ✅ 双区改造完成 |
| frontend-engineer (Ken) | v3.2 | ✅ 双区改造完成 |
| project-auditor (Judge) | v3.2 | ✅ 双区改造完成 |
| Rules | v3.1 | 🔄 待 v3.2 验证后更新 |

---

## 变更历史

| 日期 | 版本 | 变更内容 | 作者 |
|---|---|---|---|
| 原始 | v1.0 | 初始版本 | The Architect |
| 2026-04-22 | v3.2 | 纳入 skill-creator 审核流程；双区格式规范；更新角色清单；移除已废弃角色（Biubiu）| Atlas |
