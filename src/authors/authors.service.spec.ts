import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { BadRequestException } from '@nestjs/common';

function createPrismaMock() {
  return {
    author: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

describe('AuthorsService', () => {
  let service: AuthorsService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AuthorsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('return every authors created with created_at desc', async () => {
      prisma.author.findMany.mockResolvedValue([{ id: 'a1', name: 'Author' }]);

      const res = await service.findAll();

      expect(prisma.author.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(res).toEqual([{ id: 'a1', name: 'Author' }]);
    });
  });

  describe('findOne', () => {
    it('return an author by id', async () => {
      prisma.author.findUnique.mockResolvedValue({ id: 'a1', name: 'A' });

      const res = await service.findOne('a1');

      expect(prisma.author.findUnique).toHaveBeenCalledWith({
        where: { id: 'a1' },
      });
      expect(res).toEqual({ id: 'a1', name: 'A' });
    });
  });

  describe('create', () => {
    it('create an author with name', async () => {
      prisma.author.create.mockResolvedValue({ id: 'a2', name: 'New' });

      const dto = { name: 'New' };
      const res = await service.create(dto);

      expect(prisma.author.create).toHaveBeenCalledWith({
        data: { name: 'New' },
      });
      expect(res).toEqual({ id: 'a2', name: 'New' });
    });
  });

  describe('patch', () => {
    it('update the name of an author', async () => {
      prisma.author.update.mockResolvedValue({ id: 'a3', name: 'Updated' });

      const dto = { name: 'Updated' };
      const res = await service.patch(dto, 'a3');

      expect(prisma.author.update).toHaveBeenCalledWith({
        where: { id: 'a3' },
        data: { name: 'Updated' },
      });
      expect(res).toEqual({ id: 'a3', name: 'Updated' });
    });

    it('patch -> 400 if name is empty', async () => {
      await expect(service.patch({ name: '' }, 'a1'))
        .rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('delete', () => {
    it('delete an author by id', async () => {
      prisma.author.delete.mockResolvedValue({ id: 'a4', name: 'X' });

      const res = await service.delete('a4');

      expect(prisma.author.delete).toHaveBeenCalledWith({
        where: { id: 'a4' },
      });
      expect(res).toEqual({ id: 'a4', name: 'X' });
    });
  });
});
