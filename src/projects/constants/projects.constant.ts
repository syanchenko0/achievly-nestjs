import { v4 as uuid } from 'uuid';

const DEFAULT_PROJECT_COLUMNS = [
  {
    id: uuid(),
    name: 'Нужно сделать',
    order: 0,
    is_removable: false,
    is_task_creation_allowed: true,
    is_final_stage: false,
  },
  {
    id: uuid(),
    name: 'В работе',
    order: 1,
    is_removable: true,
    is_task_creation_allowed: false,
    is_final_stage: false,
  },
  {
    id: uuid(),
    name: 'Завершено',
    order: 2,
    is_removable: true,
    is_task_creation_allowed: false,
    is_final_stage: true,
  },
];

enum PROJECT_TASK_PRIORITY {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export { DEFAULT_PROJECT_COLUMNS, PROJECT_TASK_PRIORITY };
