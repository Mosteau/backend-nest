import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskEntity } from './entities';

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
   */
  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * GET /tasks
   * Récupérer toutes les tâches
   */
  @Get()
  findAll(): Promise<TaskEntity[]> {
    return this.tasksService.findAll();
  }

  /**
   * GET /tasks/:id
   * Récupérer une tâche par son ID
   */
  @Get(':id')
  findById(@Param('id') id: string): Promise<TaskEntity> {
    return this.tasksService.findById(id);
  }

  /**
   * PATCH /tasks/:id
   * Mettre à jour une tâche existante
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return this.tasksService.update(id, updateTaskDto);
  }

  /**
   * DELETE /tasks/:id
   * Supprimer une tâche
   */
  @Delete(':id')
  delete(@Param('id') id: string): Promise<TaskEntity> {
    return this.tasksService.delete(id);
  }
}
