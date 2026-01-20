import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
   * @param createTaskDto - Données validées pour créer la tâche (title, description)
   * @returns La tâche créée avec son ID généré par MongoDB
   * 
   * Note : Pas besoin de vérifier l'ID ici car MongoDB le génère automatiquement
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // create() : crée ET sauvegarde le document en une seule opération
    return this.taskModel.create(createTaskDto);
  }

  /**
   * Récupérer toutes les tâches
   * @returns Un tableau de toutes les tâches dans la base
   */
  async findAll(): Promise<Task[]> {
    // find() sans paramètre : récupère tous les documents de la collection
    return this.taskModel.find().exec();
  }

  /**
   * Récupérer une tâche par son ID
   * @param id - L'identifiant MongoDB de la tâche (format ObjectId)
   * @returns La tâche trouvée
   * @throws BadRequestException si l'ID n'est pas au bon format
   * @throws NotFoundException si la tâche n'existe pas
   */
  async findById(id: string): Promise<Task> {
    // 1. Vérifier que l'ID est au format MongoDB ObjectId (24 caractères hexadécimaux)
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }

    // 2. Chercher la tâche dans MongoDB
    const task = await this.taskModel.findById(id).exec();

    // 3. Si MongoDB retourne null, la tâche n'existe pas
    if (!task) {
      throw new NotFoundException(`Tâche avec l'ID ${id} introuvable`);
    }

    // 4. Retourner la tâche trouvée
    return task;
  }

  /**
   * Mettre à jour une tâche existante
   * @param id - L'identifiant de la tâche à modifier
   * @param updateTaskDto - Les champs à mettre à jour (title, description, completed)
   * @returns La tâche mise à jour
   * @throws BadRequestException si l'ID n'est pas valide
   * @throws NotFoundException si la tâche n'existe pas
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // 1. Vérifier le format de l'ID
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }

    // 2. Mettre à jour la tâche
    // { new: true } : retourne la tâche APRÈS modification (sinon on reçoit l'ancienne version)
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, { new: true }).exec();

    // 3. Vérifier si la tâche existe
    if (!task) {
      throw new NotFoundException(`Tâche avec l'ID ${id} introuvable`);
    }

    // 4. Retourner la tâche modifiée
    return task;
  }

  /**
   * Supprimer une tâche
   * @param id - L'identifiant de la tâche à supprimer
   * @returns La tâche supprimée (utile pour confirmer quelle tâche a été supprimée)
   * @throws BadRequestException si l'ID n'est pas valide
   * @throws NotFoundException si la tâche n'existe pas
   */
  async delete(id: string): Promise<Task> {
    // 1. Vérifier le format de l'ID
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }

    // 2. Supprimer la tâche de MongoDB
    const task = await this.taskModel.findByIdAndDelete(id).exec();

    // 3. Vérifier si la tâche existait
    if (!task) {
      throw new NotFoundException(`Tâche avec l'ID ${id} introuvable`);
    }

    // 4. Retourner la tâche supprimée
    return task;
  }
}
