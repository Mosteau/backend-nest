import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

/**
 * Controller qui gère les routes HTTP pour les tâches
 * Toutes les routes commencent par /tasks
 */
@Controller('tasks')
export class TasksController {
  /**
   * Injection du service TasksService
   * readonly : empêche de modifier tasksService après l'initialisation
   */
  constructor(private readonly tasksService: TasksService) {}

  /**
   * POST /tasks
   * Créer une nouvelle tâche
   * @Body() : extrait le corps de la requête HTTP et le valide avec CreateTaskDto
   */
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * GET /tasks
   * Récupérer toutes les tâches
   */
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  /**
   * GET /tasks/:id
   * Récupérer une tâche par son ID
   * @Param('id') : extrait le paramètre 'id' de l'URL
   * Exemple : GET /tasks/507f1f77bcf86cd799439011
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    // Pas de '+id' ! Les IDs MongoDB sont des strings
    return this.tasksService.findById(id);
  }

  /**
   * PATCH /tasks/:id
   * Mettre à jour une tâche existante
   * @Param('id') : extrait l'ID de l'URL
   * @Body() : extrait les champs à modifier et les valide avec UpdateTaskDto
   * Exemple : PATCH /tasks/507f1f77bcf86cd799439011
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  /**
   * DELETE /tasks/:id
   * Supprimer une tâche
   * @Param('id') : extrait l'ID de l'URL
   * Exemple : DELETE /tasks/507f1f77bcf86cd799439011
   */
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
