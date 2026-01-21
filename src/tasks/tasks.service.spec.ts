import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';
import { TaskStatus, TaskPriority } from '../common/enums';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
      };

      const mockTask = {
        _id: '507f1f77bcf86cd799439011',
        ...createTaskDto,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskModel.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(mockTaskModel.create).toHaveBeenCalledWith(createTaskDto);
      expect(result.title).toBe(createTaskDto.title);
      expect(result.id).toBe(mockTask._id);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const mockTasks = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'Task 1',
          status: TaskStatus.TODO,
          priority: TaskPriority.HIGH,
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTaskModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTasks),
      });

      const result = await service.findAll();

      expect(mockTaskModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Task 1');
    });
  });
});
