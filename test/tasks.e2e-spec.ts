import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

/**
 * Tests E2E (End-to-End) pour le CRUD des tâches
 * Ces tests simulent de vraies requêtes HTTP vers l'API
 */
describe('Tasks API (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let createdTaskId: string; // Pour stocker l'ID d'une tâche créée

  /**
   * Avant tous les tests : initialiser l'application
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Appliquer le même ValidationPipe que dans main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // Récupérer la connexion MongoDB pour nettoyer la base entre les tests
    connection = moduleFixture.get<Connection>(getConnectionToken());
  });

  /**
   * Après chaque test : nettoyer la base de données
   */
  afterEach(async () => {
    const collections = connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  /**
   * Après tous les tests : fermer l'application et la connexion
   */
  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  // ========================================
  // POST /tasks - Créer une tâche
  // ========================================

  describe('POST /tasks', () => {
    it('✅ devrait créer une tâche avec title et description', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Ma première tâche',
          description: 'Description de test',
        })
        .expect(201); // Code HTTP 201 Created

      // Vérifier la structure de la réponse
      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe('Ma première tâche');
      expect(response.body.description).toBe('Description de test');
      expect(response.body.completed).toBe(false); // Valeur par défaut
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      // Sauvegarder l'ID pour les tests suivants
      createdTaskId = response.body._id;
    });

    it('✅ devrait créer une tâche sans description (optionnelle)', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Tâche sans description',
        })
        .expect(201);

      expect(response.body.title).toBe('Tâche sans description');
      expect(response.body.description).toBeUndefined();
    });

    it('❌ devrait rejeter une tâche sans title (champ requis)', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          description: 'Description sans titre',
        })
        .expect(400); // Bad Request
    });

    it('❌ devrait rejeter une tâche avec title vide', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: '',
        })
        .expect(400);
    });

    it('❌ devrait rejeter une tâche avec title trop long (>200 caractères)', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'a'.repeat(201), // 201 caractères
        })
        .expect(400);
    });

    it('❌ devrait rejeter une tâche avec description trop longue (>1000 caractères)', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Titre valide',
          description: 'a'.repeat(1001), // 1001 caractères
        })
        .expect(400);
    });

    it('❌ devrait rejeter une tâche avec des champs inconnus', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Titre valide',
          champInconnu: 'valeur', // Champ non autorisé
        })
        .expect(400);
    });
  });

  // ========================================
  // GET /tasks - Lister toutes les tâches
  // ========================================

  describe('GET /tasks', () => {
    it('✅ devrait retourner un tableau vide si aucune tâche', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('✅ devrait retourner toutes les tâches créées', async () => {
      // Créer 3 tâches
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Tâche 1' });

      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Tâche 2' });

      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Tâche 3' });

      // Récupérer toutes les tâches
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0].title).toBe('Tâche 1');
      expect(response.body[1].title).toBe('Tâche 2');
      expect(response.body[2].title).toBe('Tâche 3');
    });
  });

  // ========================================
  // GET /tasks/:id - Récupérer une tâche
  // ========================================

  describe('GET /tasks/:id', () => {
    beforeEach(async () => {
      // Créer une tâche avant chaque test
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Tâche de test' });

      createdTaskId = response.body._id;
    });

    it('✅ devrait récupérer une tâche par son ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .expect(200);

      expect(response.body._id).toBe(createdTaskId);
      expect(response.body.title).toBe('Tâche de test');
    });

    it('❌ devrait retourner 404 si la tâche n\'existe pas', async () => {
      const fakeId = '507f1f77bcf86cd799439011'; // ID valide mais inexistant

      await request(app.getHttpServer())
        .get(`/tasks/${fakeId}`)
        .expect(404);
    });

    it('❌ devrait retourner 400 si l\'ID est invalide', async () => {
      await request(app.getHttpServer())
        .get('/tasks/id-invalide')
        .expect(400);
    });
  });

  // ========================================
  // PATCH /tasks/:id - Modifier une tâche
  // ========================================

  describe('PATCH /tasks/:id', () => {
    beforeEach(async () => {
      // Créer une tâche avant chaque test
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Tâche originale',
          description: 'Description originale',
        });

      createdTaskId = response.body._id;
    });

    it('✅ devrait modifier le title d\'une tâche', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({ title: 'Titre modifié' })
        .expect(200);

      expect(response.body.title).toBe('Titre modifié');
      expect(response.body.description).toBe('Description originale'); // Inchangé
    });

    it('✅ devrait modifier la description d\'une tâche', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({ description: 'Nouvelle description' })
        .expect(200);

      expect(response.body.description).toBe('Nouvelle description');
      expect(response.body.title).toBe('Tâche originale'); // Inchangé
    });

    it('✅ devrait marquer une tâche comme terminée', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({ completed: true })
        .expect(200);

      expect(response.body.completed).toBe(true);
    });

    it('✅ devrait modifier plusieurs champs en même temps', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          title: 'Nouveau titre',
          description: 'Nouvelle description',
          completed: true,
        })
        .expect(200);

      expect(response.body.title).toBe('Nouveau titre');
      expect(response.body.description).toBe('Nouvelle description');
      expect(response.body.completed).toBe(true);
    });

    it('❌ devrait retourner 404 si la tâche n\'existe pas', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await request(app.getHttpServer())
        .patch(`/tasks/${fakeId}`)
        .send({ title: 'Nouveau titre' })
        .expect(404);
    });

    it('❌ devrait retourner 400 si l\'ID est invalide', async () => {
      await request(app.getHttpServer())
        .patch('/tasks/id-invalide')
        .send({ title: 'Nouveau titre' })
        .expect(400);
    });

    it('❌ devrait rejeter des champs inconnus', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({ champInconnu: 'valeur' })
        .expect(400);
    });
  });

  // ========================================
  // DELETE /tasks/:id - Supprimer une tâche
  // ========================================

  describe('DELETE /tasks/:id', () => {
    beforeEach(async () => {
      // Créer une tâche avant chaque test
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Tâche à supprimer' });

      createdTaskId = response.body._id;
    });

    it('✅ devrait supprimer une tâche', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .expect(200);

      // Vérifier que la tâche supprimée est retournée
      expect(response.body._id).toBe(createdTaskId);
      expect(response.body.title).toBe('Tâche à supprimer');

      // Vérifier que la tâche n'existe plus
      await request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .expect(404);
    });

    it('❌ devrait retourner 404 si la tâche n\'existe pas', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      await request(app.getHttpServer())
        .delete(`/tasks/${fakeId}`)
        .expect(404);
    });

    it('❌ devrait retourner 400 si l\'ID est invalide', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/id-invalide')
        .expect(400);
    });
  });
});
