# Supervisor 协议约束条款

> **用途**：定义 Supervisor、Role/Skill、Action 层的权限边界和行为约束。

---

## 一、核心约束

### 1.1 工具路由权限

| 角色 | 权限 | 说明 |
|---|---|---|
| **Supervisor** | ✅ 可路由工具 | 唯一有权决定调用哪个工具 |
| **Role/Skill** | ❌ 默认无路由权限 | 只能基于裁剪上下文生成内容 |
| **Action 层** | ❌ 不路由工具 | 只执行 Steps，返回 Observations |

**例外**：
- Supervisor 可授权特定 Role 临时路由权限（通过 Plan 中的 `constraints.authorized_tools` 字段）

### 1.2 上下文传递约束

| 层级 | 接收内容 | 说明 |
|---|---|---|
| **Supervisor → CLI Translator** | Plan(JSON) | 极薄，只有 type/constraints/expected_output |
| **CLI Translator → Action** | Steps(JSON) | 结构化命令序列 |
| **Action → Role/Skill** | Observations(裁剪后) | 只返回必要信息，不返回中间日志 |
| **Role/Skill → Supervisor** | 生成物(JSON) | 结构化产出 + 状态 |

**约束**：
- Action 层禁止返回完整的工具执行日志给 Role/Skill
- 只返回裁剪后的 Observations：`{ artifacts: [...], metrics: {...}, errors: [...] }`

---

## 二、Supervisor 职责边界

### 2.1 必须做

| 职责 | 说明 |
|---|---|
| 意图识别 | 解析用户输入，确定 Plan.type |
| Plan 生成 | 输出符合 Plan Schema 的结构化对象 |
| Stop Conditions 判断 | 检查是否需要追问用户 |
| 错误处理 | 捕获 Action 层错误码，决定重试或追问 |

### 2.2 禁止做

| 禁止事项 | 原因 |
|---|---|
| 直接执行工具 | 必须通过 CLI 转译层 |
| 硬编码路径 | 由 Action 层解析 |
| 跳过 Stop Conditions | 禁止猜测执行 |
| 修改文件 | 文件操作由 Action 层执行 |

---

## 三、Role/Skill 职责边界

### 3.1 必须做

| 职责 | 说明 |
|---|---|
| 基于裁剪上下文生成 | 只使用 Action 层传入的 Observations |
| 输出结构化结果 | 必须符合接口契约（Input/Output/Failure Codes） |
| 触发 Stop Conditions | 检测输入不足时返回缺失字段列表 |

### 3.2 禁止做（默认）

| 禁止事项 | 原因 |
|---|---|---|
| 调用工具 | 除非 Supervisor 明确授权 |
| 路由其他 Skill | 只能被 Supervisor 调用 |
| 读取非授权文件 | 只能访问 Action 层传入的文件内容 |
| 执行脚本 | 由 Action 层执行 |

---

## 四、Action 层职责边界

### 4.1 必须做

| 职责 | 说明 |
|---|---|
| 执行 Steps | 按 CLI 转译层输出的命令序列执行 |
| 返回裁剪后的 Observations | 不返回完整日志，只返回关键产物 |
| 错误码处理 | 捕获错误，返回结构化错误码 |
| 缓存管理 | 检查 cache_key，命中则返回缓存结果 |

### 4.2 禁止做

| 禁止事项 | 原因 |
|---|---|---|
| 业务决策 | 只执行，不决策 |
| 内容生成 | 只调用 Skill，不自发生成内容 |
| 修改 Plan | Plan 由 Supervisor 生成，Action 只消费 |
| 路由 Role | 由 Supervisor 决定调用哪个 Role/Skill |

---

## 五、授权机制

### 5.1 Plan 中的授权字段

```json
{
  "plan": {
    "type": "build",
    "constraints": {
      "authorized_tools": ["read_file", "write_file", "run_npm"]
    }
  }
}
```

### 5.2 授权流程

```
1. Supervisor 识别需要授权的场景
2. 在 Plan.constraints.authorized_tools 中声明
3. CLI 转译层将授权信息传递给 Action 层
4. Action 层在执行时检查授权
5. 未授权的操作返回错误码 E_UNAUTHORIZED
```

---

## 六、错误码汇总

| 错误码 | 含义 | 处理方 |
|---|---|---|
| `E_INVALID_TYPE` | Plan.type 不合法 | Supervisor |
| `E_MISSING_TYPE` | 缺少 Plan.type | Supervisor |
| `E_UNAUTHORIZED` | 未授权的工具调用 | Action 层 |
| `E_FILE_NOT_FOUND` | 文件不存在 | Action 层 |
| `E_SCRIPT_FAILED` | 脚本执行失败 | Action 层 |
| `E_SKILL_FAILED` | Skill 调用失败 | Action 层 |
| `E_STOP_CONDITION` | 触发 Stop Condition | Supervisor |
| `E_CACHE_MISS` | 缓存未命中（非错误，仅记录） | Action 层 |

---

## 七、协议版本

| 版本 | 日期 | 变更 |
|---|---|---|
| v1.0 | 2026-04-16 | 初始版本 |
| v3.2 | 2026-04-22 | 新增 model_mode 判定规则（方案 C：产出物回收判定） |

---

## 八、model_mode 判定规则（v3.2）

> **触发时机**：define 阶段完成，`prd(input).md` 写入后，design 阶段开始前。
> **目的**：判断当前模型是否具备 [CREATIVE] 区执行能力，决定 design/audit 阶段是否开启创意通道。

### 8.1 判定字段

检查 `Source/[Name]/input/prd(input).json` 的 **`emotion_goal`** 字段值。

### 8.2 判定规则

**步骤 1**：提取情绪目标字段值

**步骤 2**：检查是否含**禁止词**（弱模型信号）

```
禁止词列表：提升体验、好用、简洁、高效、方便、易用、流畅、优化、提升、改善
```

**步骤 3**：检查是否含**感官词**（强模型信号）

```
感官词列表：触、光、温、重、冷、暖、轻、沉、软、硬、明、暗、
            厚、薄、滑、粗、近、远、快、慢（作为感受描述时）
```

**步骤 4**：判定

| 条件 | model_mode | 含义 |
|---|---|---|
| 含感官词 且 不含禁止词 | `creative` | 强模型，开启 [CREATIVE] 区 |
| 含禁止词 或 不含感官词 | `standard` | 标准模式，仅 [STRUCTURE] 区 |

### 8.3 判定结果写入

判定完成后，将结果写入 `project_state.json`：

```json
{
  "model_mode": "creative",
  "model_mode_reason": "情绪目标含感官词'轻盈'，无禁止词",
  "model_mode_checked_at": "define"
}
```

### 8.4 下游影响

| 阶段 | creative 模式 | standard 模式 |
|---|---|---|
| design（Bob） | 开启 [CREATIVE] 区，输出质量阶梯示例 | 仅 [STRUCTURE] 区，跳过 [CREATIVE] |
| audit（Judge） | 运行双通道（结构 + 创意评分） | 仅运行结构通道，创意评分记 N/A |

---

## 八、落地检查清单

- [ ] Supervisor 不直接执行工具
- [ ] Role/Skill 默认无工具路由权限
- [ ] Action 层只返回裁剪后的 Observations
- [ ] Plan 包含 Stop Conditions
- [ ] 错误码可被结构化处理
