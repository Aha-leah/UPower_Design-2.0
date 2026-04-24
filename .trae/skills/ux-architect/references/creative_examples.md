# Mia [CREATIVE] 创意加分区

> ⚡ 强模型加分区 — 弱模型可完整跳过本节。不作为质量门禁。

## Section 命名的质量阶梯

| 层级 | 示例 | 说明 |
|---|---|---|
| ❌ 不合格 | `["Box", "Wrapper", "Item"]` | 无语义，Ken 无法理解意图 |
| ✓ 合格 | `["HeroTitle", "CtaButton", "FeatureCard"]` | 有语义，可识别 |
| ✨ 优秀 | `["GravityHeroTitle", "InstantNoteInput", "ZenModeToggle"]` | 融合品牌感知 + 功能 |

## AIDA 深度映射提示

- **Attention（hero）**：components 应包含产品核心隐喻相关的组件
- **Interest**：根据 PRD P0 功能映射 section type
- **Desire**：社会证明类放在 Action 之前，降低转化摩擦
- **Action**：CTA components 命名应包含 PRD §2.4 首要动作关键词
