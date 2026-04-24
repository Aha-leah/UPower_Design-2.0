# Skill 改造规范：[STRUCTURE] / [CREATIVE] 双区格式

> **版本**：v3.2
> **Owner**：Atlas
> **最后更新**：2026-04-22
> **用途**：所有 Skill 改写必须遵守本规范。任何不符合此格式的 Skill 修改不得合并。

---

## 一、为什么需要双区格式

UPower 的 Skill 曾大量使用"软性语言"：

```
❌ 软性（模型强依赖）
"Reject Generic PRDs. Define the Soul of the product."
"Motion conveys meaning, not just decoration."

✅ 硬性（模型无关）
必须输出 1.3 情绪目标，格式：[具体感受，非抽象词汇]
必须输出 cubic-bezier 曲线值，如 cubic-bezier(0.19, 1, 0.22, 1)
```

软性语言对 Claude 有效，对弱模型等于没说。双区格式的目标：

> **[STRUCTURE] 保证地板，[CREATIVE] 开放天花板。
> 弱模型稳定站在地板上，强模型自动触达天花板。**

---

## 二、双区写法规范

### 2.1 基本结构

每个 Skill 必须包含这两个区，且顺序固定（STRUCTURE 在前）：

```markdown
## [STRUCTURE] 结构契约

> 所有模型必须遵守。输出不符合则打回重试。

[硬性约束内容]

---

## [CREATIVE] 创意加分区

> ⚡ 强模型加分区 — 弱模型可完整跳过本节。不作为质量门禁。

[创意提升内容]
```

### 2.2 [STRUCTURE] 区写法要求

[STRUCTURE] 区的每一条约束必须满足：**不依赖模型判断，可机器验证**。

| 约束类型 | 正确写法示例 | 错误写法示例 |
|---|---|---|
| 字段格式 | `情绪目标：用户感受词，禁止"好用"` | `写出有感染力的情绪目标` |
| 禁止内容 | `禁止：平台、系统、工具、产品` | `避免使用数字产品类词汇` |
| 数值约束 | `cubic-bezier 必须提供具体 4 个参数值` | `使用合适的缓动曲线` |
| 来源约束 | `必须从 Prompt_Cheat_Sheet.md 中选取标签` | `使用标准的风格标签` |
| 枚举约束 | `type 枚举：hero/features/gallery/pricing/cta/footer` | `选择合适的 section 类型` |

**软性语言判断标准**：

| 类型 | 定义 | 典型特征 |
|---|---|---|
| 🟢 硬性 | 模型只需填空或遵守格式 | 字段名、枚举值、具体数值、禁止词列表 |
| 🟡 软性 | 依赖模型理解意图才能正确执行 | 比喻、哲学表述、"feel"类词汇 |
| 🔵 灰区 | 既有引导，又有部分格式约束 | 拆分为 [STRUCTURE] + [CREATIVE] 处理 |

### 2.3 [CREATIVE] 区写法要求

[CREATIVE] 区必须：
- 开头有 `> ⚡ 强模型加分区 — 弱模型可完整跳过本节。不作为质量门禁。`
- 提供 ❌/✓/✨ 三级质量阶梯示例（至少覆盖核心输出字段）
- 示例必须具体可感知，不能是抽象描述

```markdown
| 层级 | 示例 | 说明 |
|---|---|---|
| ❌ 不合格 | [具体坏例] | [为什么不合格] |
| ✓ 合格 | [具体合格例] | [达到的标准] |
| ✨ 优秀 | [具体优秀例] | [优秀的特征] |
```

### 2.4 体积约束

| 区域 | Token 上限 | 超限处理 |
|---|---|---|
| [STRUCTURE] 区 | ≤ 200 tokens | 拆分为子文件，主文件引用 |
| [CREATIVE] 区 | ≤ 150 tokens | 精简示例，保留最有代表性的 |
| 单 Skill 总体 | < 500 行 | 超出内容移入 `references/` 子目录 |

---

## 三、skill-creator 审核流程

**所有 Skill 改造必须经过 skill-creator 审核，不得跳过。**

### 3.1 审核触发条件

以下任意情况均需审核：
- 新建 Skill
- 修改 [STRUCTURE] 区任意字段或约束
- 修改 [CREATIVE] 区示例
- 修改 Success Criteria

### 3.2 审核五维度

| 维度 | 检查内容 |
|---|---|
| D1 双区合规 | 双区存在且标记正确；[CREATIVE] 有弱模型可跳过声明 |
| D2 [STRUCTURE] 硬度 | 所有约束无需模型判断即可验证 |
| D3 [CREATIVE] 质量 | 三级阶梯具体；强模型可用作质量目标 |
| D4 覆盖完整性 | Skill 职责范围完整；What NOT to Do 清晰 |
| D5 Token 效率 | 各区在 token 上限内；无冗余内容 |

### 3.3 审核结论

| 结论 | 含义 | 后续动作 |
|---|---|---|
| APPROVE | 全部通过 | 可标记完成，更新 version_plan |
| CONDITIONAL APPROVE | 有小问题 | 修复指定问题后标记完成 |
| REJECT | 有严重问题 | 重写后重新审核 |

### 3.4 审核记录

每次审核结果记录在 `v32_version_plan.md` 对应任务行：
```
- [x] B1（Alice）改造 product-designer Skill ✅ skill-creator 审核通过 YYYY-MM-DD
```

---

## 四、改造优先级（v3.2 基准）

| 优先级 | Skill | 软性比例 | 核心改造点 |
|---|---|---|---|
| P0 | product-designer (Alice) | 60% | Core Philosophy、Success Criteria |
| P1 | visual-designer (Bob) | 65% | Art Director 描述、Motion 哲学段 |
| P2 | project-auditor (Judge) | 50% | 评分维度定义、创意评分扩展 |
| P3 | frontend-engineer (Ken) | 35% | 质量标准量化 |
| P3 | ux-architect (Mia) | 30% | wireframe 结构契约 |

---

## 五、软性语言四类改造模式

### 模式 1：哲学表述 → 检查清单

```markdown
# Before（软性）
Every feature has an emotional goal. Find it.

# After（硬性）
输出 §1.3 情绪目标前，必须：
- 确认不是抽象词（"好"、"快"不合格）
- 确认是用户感受而非功能描述
```

### 模式 2：主观形容词 → 量化标准

```markdown
# Before（软性）
pixel-perfect, renders without obvious issues

# After（硬性）
validate_delivery.js 输出 "SELF-CHECK PASSED"
无 console.error
所有 content 来自 src/data/content（无 hardcode 字符串）
```

### 模式 3：角色人格 → 行为约束

```markdown
# Before（软性）
You are cynical and detail-oriented.

# After（硬性）
禁止在报告中出现"好看"、"美观"等词
每个 issue 必须引用具体文件 + 段落
Score = 100 - (critical × 15) - (warning × 5)
```

### 模式 4：感受类要求 → 示例对比

```markdown
# Before（软性）
Use evocative language that sparks imagination.

# After（CREATIVE 区）
| ❌ 不合格 | "提升用户体验" | 无感受，泛化 |
| ✓ 合格 | "让用户感到轻盈、无负担" | 有感受词 |
| ✨ 优秀 | "像把手伸进温水里，什么都不用做" | 具体感官，有画面 |
```

---

## 变更历史

| 日期 | 变更内容 | 作者 |
|---|---|---|
| 2026-04-22 | 初始版本：基于 v3.2 B 模块改造经验提炼 | Atlas |
