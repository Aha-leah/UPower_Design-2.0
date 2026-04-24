# Alice Skill 接口规范

## 1. `load_context`
- **Input**: `{ project_path: string }`
- **Output**: `{ existing_files: string[], gaps: string[], constraints: object }`
- **Failure Codes**:
  | Code | Meaning | Action |
  |---|---|---|
  | `E001` | Project path not found | Ask user to confirm project name |
  | `E002` | No input files in `for_prd/` | Prompt user to provide raw notes/screenshots |

## 2. `generate_experience_prd`
- **Input**: `{ for_prd_contents: string[], context: object, template_path: string }`
- **Output**: `{ prd_path: string, sections_generated: string[] }`
- **Failure Codes**:
  | Code | Meaning | Action |
  |---|---|---|
  | `E010` | Insufficient input | Ask user for more context |
  | `E011` | Template not found | Fall back to default structure, warn user |
  | `E012` | Stop condition triggered | Return list of missing required fields |

## 3. `generate_brand_dna`
- **Input**: `{ prd_path: string, context: object }`
- **Output**: `{ brand_dna_path: string, dimensions: string[] }`
- **Failure Codes**:
  | Code | Meaning | Action |
  |---|---|---|
  | `E020` | PRD not found | Run `generate_experience_prd` first |
  | `E021` | Emotional tone ambiguous | Ask user: "Should this feel [X] or [Y]?" |

## 4. `validate_prd_completeness`
- **Input**: `{ prd_path: string, criteria: string[] }`
- **Output**: `{ passed: boolean, missing_fields: string[], warnings: string[] }`
- **Failure Codes**:
  | Code | Meaning | Action |
  |---|---|---|
  | `E030` | PRD file not found | Run `generate_experience_prd` first |
  | `E031` | Critical fields missing | Return missing fields list, block downstream |

## 5. `extract_experience_goals`
- **Input**: `{ raw_notes: string[], max_goals: number }`
- **Output**: `{ goals: { goal: string, priority: number }[] }`
- **Failure Codes**:
  | Code | Meaning | Action |
  |---|---|---|
  | `E040` | No recognizable goals | Ask user: "What should the user feel?" |
  | `E041` | Too many goals (>10) | Auto-prioritize, ask user to confirm top 5 |

## 6. `generate_user_journey_map`
- **Input**: `{ prd_path: string, brand_dna_path: string }`
- **Output**: `{ journey_stages: { stage: string, emotion: string, touchpoint: string }[] }`
- **Failure Codes**:
  | Code | Meaning | Action |
  |---|---|---|
  | `E050` | PRD or Brand DNA missing | Run prerequisite skills first |
  | `E051` | Insufficient touchpoint data | Ask user for key user actions |
