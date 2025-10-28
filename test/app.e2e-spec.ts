import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let user: { id: string; email: string; name: string };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@test.com', password: 'pass1234', name: 'John Doe' })
      .expect(201);

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'pass1234' })
      .expect(201);

    expect(body?.accessToken).toBeTruthy();
    token = body.accessToken;
    user = body.user;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('books', () => {
    it('POST /books -> creates a book', async () => {
      const res = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Le culte de la liberté', authorNames: ['George Orwell'], year: 1949, genreNames: ['Dystopian'] })
        .expect(201);

      expect(res.body).toEqual(expect.objectContaining({
        id: expect.any(String),
        title: 'Le culte de la liberté',
        year: 1949,
        genres: expect.arrayContaining(['Dystopian']),
        authors: expect.arrayContaining([
          expect.objectContaining({ name: 'George Orwell' }),
        ]),
      }));
    });

    it('GET /books -> get all books', async () => {
      const res = await request(app.getHttpServer()).get('/books').expect(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /books/:id -> get one book', async () => {
      const { body: books } = await request(app.getHttpServer())
        .get('/books')
        .expect(200);
      const booksId = books[0].id;

      const res = await request(app.getHttpServer())
        .get(`/books/${booksId}`)
        .expect(200);
      expect(res.body).toMatchObject({ id: booksId, title: books[0].title, year: books[0].year, genres: books[0].genres, authors: books[0].authors });
    });
  });

  describe('reservations', () => {
    it('POST /reservations -> creates then rejects overlap', async () => {
      const { body: books } = await request(app.getHttpServer())
        .get('/books')
        .expect(200);

      const bookId = books[0].id;
      const dueDate = new Date('2025-11-22T10:00:00.000Z').toISOString();

      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId: bookId,
          dueDate: dueDate,
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/reservations')
        .set('Authorization', `Bearer ${token}`)
        .send({
          bookId: bookId,
          dueDate: dueDate,
        })
        .expect(400);
    });

    it('GET /reservations -> get all reservations', async () => {
      const res = await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /reservations/:id -> get one reservation', async () => {
      const { body: reservations } = await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const reservationId = reservations[0].id;

      const res = await request(app.getHttpServer())
        .get(`/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body).toMatchObject({ id: reservationId });
    });

    it('PATCH /reservations/:id -> updates a reservation', async () => {
      const { body: reservations } = await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const reservationId = reservations[0].id;
      const newDueDate = new Date('2025-11-28T10:00:00.000Z').toISOString();

      const res = await request(app.getHttpServer())
        .patch(`/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ dueDate: newDueDate })
        .expect(200);
      expect(res.body).toMatchObject({
        id: reservationId,
        dueDate: newDueDate,
      });
    });

    it('DELETE /reservations/:id -> deletes a reservation', async () => {
      const { body: reservations } = await request(app.getHttpServer())
        .get('/reservations')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const reservationId = reservations[0].id;

      await request(app.getHttpServer())
        .delete(`/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
