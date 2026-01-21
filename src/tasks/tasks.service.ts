import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskEntity } from './entities';

/**
 * Service qui gère la logique métier des tâches
 * C'est ici qu'on communique avec MongoDB via Mongoose
 */
@Injectable()
export class TasksService {
  /**
   * Injection du modèle Mongoose Task dans le constructeur
   * @InjectModel(Task.name) : NestJS injecte automatiquement le modèle
   * taskModel : permet d'effectuer des opérations CRUD sur la collection MongoDB
   */
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  /**
   * Créer une nouvelle tâche
   * @param createTaskDto - Données validées pour créer la tâche
   * @returns L'entity Task créée
   */
  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const task = await this.taskModel.create(createTaskDto);
    return this.toEntity(task);
  }

  /**
   * Récupérer toutes les tâches
   * @returns Un tableau de toutes les tâches
   */
  async findAll(): Promise<TaskEntity[]> {
    const tasks = await this.taskModel.find().exec();
    return tasks.map(task => this.toEntity(task));
  }

  /**
   * Récupérer une tâche par son ID
   * @param id - L'identifiant MongoDB de la tâche
   * @returns L'entity Task trouvée
   * @throws BadRequestException si l'ID n'est pas au bon format
   * @throws NotFoundException si la tâche n'existe pas
   */
  async findById(id: string): Promise<TaskEntity> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }

    const task = await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException(`Tâche avec l'ID ${id} introuvable`);
    }

    return this.toEntity(task);
  }

  /**
   * Mettre à jour une tâche existante
   * @param id - L'identifiant de la tâche à modifier
   * @param updateTaskDto - Les champs à mettre à jour
   * @returns L'entity Task mise à jour
   * @throws BadRequestException si l'ID n'est pas valide
   * @throws NotFoundException si la tâche n'existe pas
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }

    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();

    if (!task) {
      throw new NotFoundException(`Tâche avec l'ID ${id} introuvable`);
    }

    return this.toEntity(task);
  }

  /**
   * Supprimer une tâche
   * @param id - L'identifiant de la tâche à supprimer
   * @returns L'entity Task supprimée
   * @throws BadRequestException si l'ID n'est pas valide
   * @throws NotFoundException si la tâche n'existe pas
   */
  async delete(id: string): Promise<TaskEntity> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }

    const task = await this.taskModel.findByIdAndDelete(id).exec();

    if (!task) {
      throw new NotFoundException(`Tâche avec l'ID ${id} introuvable`);
    }

    return this.toEntity(task);
  }

  /**
   * Convertit un document Mongoose en Entity
   * Sépare la couche base de données de la couche métier
   */
  private toEntity(doc: TaskDocument): TaskEntity {
    return new TaskEntity({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      status: doc.status,
      priority: doc.priority,
      dueDate: doc.dueDate,
      tags: doc.tags,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
