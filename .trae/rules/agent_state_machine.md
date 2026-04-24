# 虚拟员工状态机

> **用途**：定义每个虚拟员工（Agent）的状态转移规则，用于 Cockpit 显示和流程控制。

---

## 一、状态定义

| 状态 | 英文 | 含义 | 显示颜色 |
|---|---|---|---|
| **Idle** | 空闲 | 等待任务 | 灰色 |
| **Thinking** | 思考中 | 正在分析/决策 | 蓝色 |
| **Executing** | 执行中 | 正在调用工具/Skill | 绿色 |
| **Waiting** | 等待中 | 等待用户输入或其他 Agent | 黄色 |
| **Reviewing** | 审核中 | 正在执行质检 | 紫色 |
| **Error** | 错误 | 执行失败 | 红色 |
| **Completed** | 完成 | 任务完成 | 深绿色 |

---

## 二、状态转移表

### 2.1 主流程转移

```
         ┌─────────┐
         │  Idle   │
         └────┬────┘
              │ 收到任务
              ▼
         ┌─────────┐
         │ Thinking│
         └────┬────┘
              │ 决策完成
              ▼
         ┌─────────┐
    ┌────│Executing│────┐
    │    └────┬────┘    │
    │         │         │
    │ 需要用户输入    需要 Review
    │         │         │
    ▼         │         ▼
┌─────────┐   │   ┌─────────┐
│ Waiting │   │   │Reviewing│
└────┬────┘   │   └────┬────┘
     │        │        │
     │ 用户响应  │    Review 完成
     │        │        │
     └────────┼────────┘
              │
              ▼
         ┌─────────┐
         │Completed│
         └─────────┘
```

### 2.2 错误转移

```
任何状态 ──执行失败──▶ Error
    │                      │
    │                      │ 可恢复
    │                      │
    │                      ▼
    │                 重试 ──▶ Thinking
    │
    │ 不可恢复
    │
    └──────────────────▶ Idle (重置)
```

---

## 三、各 Agent 状态机

### 3.1 Atlas (Project Manager)

| 触发事件 | 当前状态 | 下一状态 | 说明 |
|---|---|---|---|
| 收到用户指令 | Idle | Thinking | 分析意图 |
| 意图识别完成 | Thinking | Executing | 生成 Plan |
| Plan 生成完成 | Executing | Waiting | 等待 CLI 转译 |
| CLI 转译完成 | Waiting | Executing | 分发 Steps |
| 需要用户确认 | Executing | Waiting | Stop Condition 触发 |
| 用户确认完成 | Waiting | Executing | 继续执行 |
| 所有 Steps 完成 | Executing | Completed | 任务完成 |
| 执行失败 | 任意 | Error | 错误处理 |

### 3.2 Alice (Product Designer)

| 触发事件 | 当前状态 | 下一状态 | 说明 |
|---|---|---|---|
| 被 Atlas 调用 | Idle | Thinking | 理解需求 |
| 分析完成 | Thinking | Executing | 调用 generate_prd |
| PRD 生成完成 | Executing | Reviewing | 验证完备性 |
| 验证通过 | Reviewing | Completed | 返回结果 |
| 验证失败 | Reviewing | Waiting | 返回缺失字段 |

### 3.3 Bob (Visual Designer)

| 触发事件 | 当前状态 | 下一状态 | 说明 |
|---|---|---|---|
| 被 Atlas 调用 | Idle | Thinking | 读取 Brand DNA |
| 分析完成 | Thinking | Executing | 生成 style/specs/motion |
| 生成完成 | Executing | Completed | 返回资产路径 |

### 3.4 Ken (Frontend Developer)

| 触发事件 | 当前状态 | 下一状态 | 说明 |
|---|---|---|---|
| 被 Atlas 调用 | Idle | Thinking | 读取 system_prompt |
| 分析完成 | Thinking | Executing | 生成组件代码 |
| 代码生成完成 | Executing | Completed | 返回项目路径 |

### 3.5 Judge (Auditor)

| 触发事件 | 当前状态 | 下一状态 | 说明 |
|---|---|---|---|
| 被 Atlas 调用 | Idle | Reviewing | 执行 Reviewer Checklist |
| Review 完成 | Reviewing | Completed | 返回报告 |
| 发现问题 | Reviewing | Error | 标记问题（非失败，而是发现问题） |

---

## 四、状态转移事件

### 4.1 事件定义

| 事件类型 | 触发条件 | 数据负载 |
|---|---|---|
| `TASK_RECEIVED` | 用户发送指令 | `{ user_input, timestamp }` |
| `THINKING_START` | 开始分析/决策 | `{ agent, task }` |
| `THINKING_END` | 决策完成 | `{ agent, decision }` |
| `EXECUTION_START` | 开始执行工具/Skill | `{ agent, skill, args }` |
| `EXECUTION_END` | 执行完成 | `{ agent, result }` |
| `WAITING_START` | 开始等待 | `{ agent, waiting_for }` |
| `WAITING_END` | 等待结束 | `{ agent, response }` |
| `REVIEW_START` | 开始审核 | `{ agent, checklist }` |
| `REVIEW_END` | 审核完成 | `{ agent, report }` |
| `ERROR_OCCURRED` | 发生错误 | `{ agent, error_code, message }` |
| `TASK_COMPLETED` | 任务完成 | `{ agent, output }` |

### 4.2 事件流转示例

```
用户: "帮我创建一个任务管理工具"
     │
     ▼
[Atlas] TASK_RECEIVED { user_input: "帮我创建一个任务管理工具" }
[Atlas] THINKING_START { agent: "atlas", task: "intent_analysis" }
[Atlas] THINKING_END { agent: "atlas", decision: { type: "define" } }
[Atlas] EXECUTION_START { agent: "atlas", skill: "load_context", args: {...} }
[Atlas] EXECUTION_END { agent: "atlas", result: {...} }
[Alice] TASK_RECEIVED { from: "atlas", task: "generate_prd" }
[Alice] THINKING_START { agent: "alice", task: "analyze_requirements" }
[Alice] THINKING_END { agent: "alice", decision: "proceed" }
[Alice] EXECUTION_START { agent: "alice", skill: "generate_experience_prd" }
[Alice] EXECUTION_END { agent: "alice", result: { prd_path: "..." } }
[Alice] TASK_COMPLETED { agent: "alice", output: { prd_path: "..." } }
[Atlas] WAITING_START { agent: "atlas", waiting_for: "brand_dna_generation" }
...
```

---

## 五、状态数据结构

### 5.1 单个 Agent 状态

```json
{
  "agent_id": "alice",
  "agent_name": "Alice",
  "agent_role": "Product Designer",
  "current_state": "Executing",
  "current_task": "generate_experience_prd",
  "state_since": "2026-04-16T10:33:00Z",
  "state_history": [
    { "state": "Idle", "entered_at": "2026-04-16T10:30:00Z", "exited_at": "2026-04-16T10:32:00Z" },
    { "state": "Thinking", "entered_at": "2026-04-16T10:32:00Z", "exited_at": "2026-04-16T10:33:00Z" },
    { "state": "Executing", "entered_at": "2026-04-16T10:33:00Z", "exited_at": null }
  ]
}
```

### 5.2 全局状态汇总

```json
{
  "timestamp": "2026-04-16T10:35:00Z",
  "agents": [
    { "agent_id": "atlas", "current_state": "Waiting", "current_task": "awaiting_user_input" },
    { "agent_id": "alice", "current_state": "Executing", "current_task": "generate_brand_dna" },
    { "agent_id": "bob", "current_state": "Idle", "current_task": null },
    { "agent_id": "ken", "current_state": "Idle", "current_task": null },
    { "agent_id": "judge", "current_state": "Idle", "current_task": null }
  ]
}
```

---

## 六、状态显示逻辑

### 6.1 Cockpit 显示

| 场景 | 显示 |
|---|---|
| 所有 Agent Idle | "等待指令" |
| 1 个 Agent 非 Idle | "[Agent名] 正在 [任务名]..." |
| 多个 Agent 非 Idle | "[n] 个 Agent 工作中"（可展开详情） |
| 任意 Agent Error | 红色警告 + 错误信息 |
| 任意 Agent Waiting | 黄色提示 + 等待原因 |

### 6.2 Agent 头像状态

```
Idle      → 灰色头像
Thinking  → 蓝色头像 + 💭 图标
Executing → 绿色头像 + ⚙️ 动画
Waiting   → 黄色头像 + ⏸️ 图标
Reviewing → 紫色头像 + 🔍 图标
Error     → 红色头像 + ❌ 图标
Completed → 深绿头像 + ✅ 图标
```

---

## 七、实现建议

### 7.1 状态管理

```typescript
// Zustand store
interface AgentState {
  agents: Record<string, Agent>;
  transition: (agentId: string, event: StateEvent) => void;
}

const useAgentStore = create<AgentState>((set) => ({
  agents: {},
  transition: (agentId, event) => set((state) => ({
    agents: {
      ...state.agents,
      [agentId]: transitionState(state.agents[agentId], event)
    }
  }))
}));
```

### 7.2 状态转移函数

```typescript
function transitionState(agent: Agent, event: StateEvent): Agent {
  const transitions: Record<string, Record<string, string>> = {
    Idle: { TASK_RECEIVED: "Thinking" },
    Thinking: { THINKING_END: "Executing" },
    Executing: { 
      EXECUTION_END: "Completed",
      NEEDS_INPUT: "Waiting",
      NEEDS_REVIEW: "Reviewing",
      ERROR: "Error"
    },
    Waiting: { INPUT_RECEIVED: "Executing" },
    Reviewing: { REVIEW_END: "Completed" },
    Error: { RETRY: "Thinking", RESET: "Idle" },
    Completed: { NEW_TASK: "Thinking" }
  };
  
  return {
    ...agent,
    current_state: transitions[agent.current_state]?.[event.type] || agent.current_state,
    state_since: new Date().toISOString()
  };
}
```
