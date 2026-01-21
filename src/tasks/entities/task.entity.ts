import { TaskStatus, TaskPriority } from '../../common/enums';

/**
 * Entity Task - Représentation métier pure (sans dépendance à MongoDB)
 * Utilisée pour typer les retours de service et les réponses API
 */
export class TaskEntity {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
