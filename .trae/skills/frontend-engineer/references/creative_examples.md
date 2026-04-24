# Ken [CREATIVE] 创意加分区

> ⚡ 强模型加分区 — 弱模型可完整跳过本节。不作为质量门禁。

## Tailwind 实现质量阶梯

| 层级 | 示例 | 说明 |
|---|---|---|
| ❌ 不合格 | `className="text-blue-500 p-4"` | 通用色值，与 DNA 无关 |
| ✓ 合格 | `className="text-primary bg-surface shadow-card"` | 使用 tailwind.config 中的语义化 token |
| ✨ 优秀 | `className="text-primary bg-surface shadow-card hover:-translate-y-0.5 transition-transform duration-150"` | token + 微交互，直接体现 DNA Tempo |

## 动效实现提示

- **Fluid & Organic**：用 `spring` 物理模型，`stiffness: 100, damping: 15`，入场用 `opacity + y`
- **Snappy & Precise**：`duration: 0.15`，`ease: [0.4, 0, 0.2, 1]`，每次点击有 `scale: 0.97` 下沉感
- **Staggered Reveal**：列表用 `staggerChildren: 0.05`，从父级 `variants` 控制
