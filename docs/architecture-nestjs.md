# 🏗️ Architecture NestJS - Guide Visuel

## 📊 Vue d'ensemble du flux d'une requête

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Postman, Frontend, curl)                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         │  HTTP Request
                                         │  POST /tasks
                                         │  { "title": "Ma tâche" }
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   NESTJS APP                                     │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                           1️⃣ VALIDATION PIPE                              │  │
│  │                                                                           │  │
│  │   • Vérifie les données entrantes avec le DTO                            │  │
│  │   • Rejette les champs inconnus (whitelist)                              │  │
│  │   • Transforme les types (string → boolean)                              │  │
│  │                                                                           │  │
│  │   ❌ Si invalide → Erreur 400 Bad Request                                │  │
│  │   ✅ Si valide → Continue vers le Controller                             │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                        │
│                                         ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                           2️⃣ CONTROLLER                                   │  │
│  │                        (tasks.controller.ts)                              │  │
│  │                                                                           │  │
│  │   • Reçoit la requête HTTP                                               │  │
│  │   • Extrait les données (@Body, @Param)                                  │  │
│  │   • Appelle le Service                                                   │  │
│  │   • Retourne la réponse HTTP                                             │  │
│  │                                                                           │  │
│  │   @Post() → create()                                                     │  │
│  │   @Get() → findAll()                                                     │  │
│  │   @Get(':id') → findById()                                               │  │
│  │   @Patch(':id') → update()                                               │  │
│  │   @Delete(':id') → delete()                                              │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                        │
│                                         ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                           3️⃣ SERVICE                                      │  │
│  │                         (tasks.service.ts)                                │  │
│  │                                                                           │  │
│  │   • Contient la logique métier                                           │  │
│  │   • Communique avec la base de données                                   │  │
│  │   • Valide les IDs MongoDB                                               │  │
│  │   • Gère les erreurs (404, 400)                                          │  │
│  │                                                                           │  │
│  │   create() → taskModel.create()                                          │  │
│  │   findAll() → taskModel.find()                                           │  │
│  │   findById() → taskModel.findById()                                      │  │
│  │   update() → taskModel.findByIdAndUpdate()                               │  │
│  │   delete() → taskModel.findByIdAndDelete()                               │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                        │
│                                         ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                           4️⃣ MONGOOSE MODEL                               │  │
│  │                         (task.schema.ts)                                  │  │
│  │                                                                           │  │
│  │   • Définit la structure des documents                                   │  │
│  │   • Validations au niveau base de données                                │  │
│  │   • Génère automatiquement les timestamps                                │  │
│  │                                                                           │  │
│  │   Task {                                                                 │  │
│  │     title: string (required, 1-200 chars)                                │  │
│  │     description?: string (optional, max 1000 chars)                      │  │
│  │     completed: boolean (default: false)                                  │  │
│  │     createdAt: Date (auto)                                               │  │
│  │     updatedAt: Date (auto)                                               │  │
│  │   }                                                                      │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                        │
└─────────────────────────────────────────│────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   MONGODB                                        │
│                                                                                  │
│   Collection: tasks                                                              │
│   Documents: { _id, title, description, completed, createdAt, updatedAt }       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure des fichiers

```
src/
├── main.ts                    # Point d'entrée de l'application
│                              # Configure le ValidationPipe global
│
├── app.module.ts              # Module racine
│                              # Importe MongooseModule et TasksModule
│
└── tasks/                     # Module feature "tasks"
    │
    ├── tasks.module.ts        # Déclare le module
    │                          # Enregistre le schéma Mongoose
    │
    ├── tasks.controller.ts    # Gère les routes HTTP
    │                          # @Controller('tasks')
    │
    ├── tasks.service.ts       # Logique métier + accès DB
    │                          # @Injectable()
    │
    ├── dto/
    │   ├── create-task.dto.ts # Validation pour POST
    │   └── update-task.dto.ts # Validation pour PATCH
    │
    └── schemas/
        └── task.schema.ts     # Schéma Mongoose
```

---

## 🔄 Cycle de vie d'une requête

### Exemple : Créer une tâche

```
1. Client envoie POST /tasks avec { "title": "Acheter du pain" }
                    │
                    ▼
2. ValidationPipe vérifie avec CreateTaskDto
   ✅ title présent et valide
                    │
                    ▼
3. TasksController.create() reçoit la requête
   Extrait le body avec @Body()
                    │
                    ▼
4. TasksService.create() est appelé
   Crée le document avec taskModel.create()
                    │
                    ▼
5. MongoDB sauvegarde le document
   Génère _id, createdAt, updatedAt
                    │
                    ▼
6. La tâche créée remonte la chaîne
                    │
                    ▼
7. Client reçoit HTTP 201 avec la tâche
   {
     "_id": "507f1f77bcf86cd799439011",
     "title": "Acheter du pain",
     "completed": false,
     "createdAt": "2026-01-20T10:00:00.000Z",
     "updatedAt": "2026-01-20T10:00:00.000Z"
   }
```

---

## 🎯 Rôle de chaque couche

### 1️⃣ DTO (Data Transfer Object)

**Fichiers :** `create-task.dto.ts`, `update-task.dto.ts`

**Rôle :** Définir et valider les données entrantes

```typescript
// Ce que le client peut envoyer pour créer une tâche
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;      // Obligatoire

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;  // Optionnel
}
```

**Pourquoi ?**
- Sécurité : rejette les données invalides
- Documentation : définit le contrat de l'API
- TypeScript : typage fort

---

### 2️⃣ Controller

**Fichier :** `tasks.controller.ts`

**Rôle :** Gérer les routes HTTP

```typescript
@Controller('tasks')  // Préfixe : /tasks
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()  // POST /tasks
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get(':id')  // GET /tasks/123
  findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }
}
```

**Pourquoi ?**
- Séparation des responsabilités
- Le controller ne contient PAS de logique métier
- Il délègue tout au service

---

### 3️⃣ Service

**Fichier :** `tasks.service.ts`

**Rôle :** Logique métier + accès base de données

```typescript
@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskModel.create(createTaskDto);
  }

  async findById(id: string): Promise<Task> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('ID invalide');
    }
    
    const task = await this.taskModel.findById(id).exec();
    
    if (!task) {
      throw new NotFoundException(`Tâche ${id} introuvable`);
    }
    
    return task;
  }
}
```

**Pourquoi ?**
- Centralise la logique métier
- Réutilisable par plusieurs controllers
- Testable unitairement

---

### 4️⃣ Schema (Mongoose)

**Fichier :** `task.schema.ts`

**Rôle :** Définir la structure des documents MongoDB

```typescript
@Schema({ timestamps: true })  // Ajoute createdAt et updatedAt
export class Task {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ trim: true, maxlength: 1000 })
  description?: string;

  @Prop({ default: false })
  completed: boolean;
}
```

**Pourquoi ?**
- Définit la structure en base de données
- Validations au niveau MongoDB
- Génère automatiquement les timestamps

---

### 5️⃣ Module

**Fichier :** `tasks.module.ts`

**Rôle :** Assembler les pièces du puzzle

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
```

**Pourquoi ?**
- Organise le code par fonctionnalité
- Déclare les dépendances
- Permet l'injection de dépendances

---

## 🔧 Injection de dépendances

NestJS gère automatiquement la création des instances :

```
┌─────────────────────────────────────────────────────────────────┐
│                         NestJS Container                         │
│                                                                  │
│   1. Crée une instance de TaskModel (Mongoose)                  │
│                          │                                       │
│                          ▼                                       │
│   2. Crée TasksService et lui injecte TaskModel                 │
│                          │                                       │
│                          ▼                                       │
│   3. Crée TasksController et lui injecte TasksService           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Tu n'as jamais besoin de faire `new TasksService()` toi-même !

---

## ❌ Gestion des erreurs

### Erreurs HTTP automatiques

| Exception NestJS | Code HTTP | Quand l'utiliser |
|-----------------|-----------|------------------|
| `BadRequestException` | 400 | Données invalides, ID mal formaté |
| `NotFoundException` | 404 | Ressource introuvable |
| `UnauthorizedException` | 401 | Non authentifié |
| `ForbiddenException` | 403 | Pas les droits |
| `ConflictException` | 409 | Conflit (doublon) |

### Exemple de réponse d'erreur

```json
{
  "statusCode": 404,
  "message": "Tâche avec l'ID 507f1f77bcf86cd799439011 introuvable",
  "error": "Not Found"
}
```

---

## 🧪 Tests

### Structure des tests

```
test/
├── tasks.e2e-spec.ts    # Tests E2E (API complète)
├── app.e2e-spec.ts      # Test de base
└── jest-e2e.json        # Configuration Jest

src/tasks/
├── tasks.controller.spec.ts  # Tests unitaires controller
└── tasks.service.spec.ts     # Tests unitaires service
```

### Types de tests

| Type | Fichier | Ce qu'il teste |
|------|---------|----------------|
| **E2E** | `*.e2e-spec.ts` | L'API complète avec vraie DB |
| **Unitaire** | `*.spec.ts` | Une classe isolée avec mocks |

---

## 📚 Ressources

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation Mongoose](https://mongoosejs.com/docs/)
- [class-validator](https://github.com/typestack/class-validator)
- [Jest](https://jestjs.io/docs/getting-started)                                     