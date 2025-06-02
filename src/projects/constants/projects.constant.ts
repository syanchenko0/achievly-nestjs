import { v4 as uuid } from 'uuid';

const DEFAULT_PROJECT_COLUMNS = [
  {
    id: uuid(),
    name: 'Нужно сделать',
    order: 0,
    removable: false,
  },
  {
    id: uuid(),
    name: 'В работе',
    order: 1,
    removable: true,
  },
  {
    id: uuid(),
    name: 'Завершено',
    order: 2,
    removable: true,
  },
];

enum PROJECT_TASK_PRIORITY {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export { DEFAULT_PROJECT_COLUMNS, PROJECT_TASK_PRIORITY };
