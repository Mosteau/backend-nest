import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TaskStatus, TaskPriority } from '../../common/enums';

export type TaskDocument = HydratedDocument<Task>;

/**
 * Schema Mongoose - Définit la structure de la collection MongoDB
 * Séparé de l'entity pour isoler les dépendances à la base de données
 */
@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true, minlength: 1, maxlength: 200 })
  title: string;

  @Prop({ trim: true, maxlength: 1000 })
  description?: string;

  @Prop({ 
    type: String, 
    enum: Object.values(TaskStatus), 
    default: TaskStatus.TODO 
  })
  status: TaskStatus;

  @Prop({ 
    type: String, 
    enum: Object.values(TaskPriority), 
    default: TaskPriority.MEDIUM 
  })
  priority: TaskPriority;

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // Timestamps ajoutés automatiquement par Mongoose
  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
