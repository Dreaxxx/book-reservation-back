import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BooksService', () => {
  let service: BooksService;

  let prisma: {
    book: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    },
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      book: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(BooksService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('return a book with include authors/genres', async () => {
      prisma.book.findUnique.mockResolvedValue({
        id: 'b1',
        title: 'T',
        authors: [],
        genres: [],
      });

      const res = await service.findOne('b1');

      expect(prisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: 'b1' },
        include: { authors: true, genres: true },
      });
      expect(res?.id).toBe('b1');
    });
  });

  describe('findAll', () => {
    it('list all books with include authors/genres', async () => {
      prisma.book.findMany.mockResolvedValue([{ id: 'b1' }]);

      const res = await service.findAll();

      expect(prisma.book.findMany).toHaveBeenCalledWith({
        include: { authors: true, genres: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(res).toEqual([{ id: 'b1' }]);
    });
  });

  describe('create', () => {
    it('create a book with include authors/genres', async () => {
      prisma.book.create.mockResolvedValue({
        id: 'b2',
        title: 'Title',
        year: 2024,
        authors: [{ name: 'Author A' }],
        genres: [{ name: 'Fantasy' }],
      });

      const dto = {
        title: 'Title',
        year: 2024,
        authorNames: ['Author A'],
        genreNames: ['Fantasy'],
      };

      const res = await service.create(dto);

      expect(prisma.book.create).toHaveBeenCalledWith({
        data: {
          title: 'Title',
          year: 2024,
          authors: {
            connectOrCreate: [
              { where: { name: 'Author A' }, create: { name: 'Author A' } },
            ],
          },
          genres: {
            connectOrCreate: [
              { where: { name: 'Fantasy' }, create: { name: 'Fantasy' } },
            ],
          },
        },
        include: { authors: true, genres: true },
      });
      expect(res.id).toBe('b2');
    });
  });

  describe('patch', () => {
    it('update a book with include authors/genres if provided', async () => {
      prisma.book.update.mockResolvedValue({
        id: 'b3',
        title: 'New',
        year: 2020,
        authors: [{ name: 'A1' }],
        genres: [{ name: 'G1' }],
      });

      const dto = {
        title: 'New',
        year: 2020,
        authorNames: ['A1'],
        genreNames: ['G1'],
      };

      const res = await service.patch(dto, 'b3');

      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: 'b3' },
        data: {
          title: 'New',
          year: 2020,
          authors: {
            connectOrCreate: [
              { where: { name: 'A1' }, create: { name: 'A1' } },
            ],
          },
          genres: {
            connectOrCreate: [
              { where: { name: 'G1' }, create: { name: 'G1' } },
            ],
          },
        },
        include: { authors: true, genres: true },
      });
      expect(res.id).toBe('b3');
    });

    it('do not update authors/genres if not provided', async () => {
      prisma.book.update.mockResolvedValue({
        id: 'b3',
        title: 'Only title',
        year: undefined,
        authors: [],
        genres: [],
      });

      const dto = { title: 'Only title' };

      await service.patch(dto, 'b3');

      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: 'b3' },
        data: {
          title: 'Only title',
          year: undefined,
          authors: undefined,
          genres: undefined,
        },
        include: { authors: true, genres: true },
      });
    });
  });

  describe('delete', () => {
    it('delete a book by id', async () => {
      prisma.book.delete.mockResolvedValue({ id: 'b4' });

      const res = await service.delete('b4');

      expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: 'b4' } });
      expect(res).toEqual({ id: 'b4' });
    });
  });
});
