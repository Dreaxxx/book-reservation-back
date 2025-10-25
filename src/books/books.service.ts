import { Delete, Get, Injectable, Patch, Post, Query } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { SearchBooksDto } from "./dto/search-book-dto";

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) { }

  @Get(':id')
  async findOne(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { authors: true },
    });
  }

  @Get()
  async findAll() {
    return this.prisma.book.findMany({
      include: { authors: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // experimental search function
  @Get('search')
  async search(@Query() dto: SearchBooksDto) {
    const { querySting, genre, autor, page = 1, pageSize = 10, sort = 'newest' } = dto;

    const where: Prisma.BookWhereInput = {};

    if (autor) {
      where.authors = { some: { name: { contains: autor, mode: 'insensitive' } } };
    }

    if (genre) {
      where.genres = { has: genre };
    }

    if (querySting) {
      const qLike = { contains: querySting, mode: 'insensitive' as const };

      where.OR = [
        { title: qLike },
        { authors: { some: { name: qLike } } },
        { genres: { has: querySting } },
      ];
    }

    const orderBy: Prisma.BookOrderByWithRelationInput =
      sort === 'title_asc' ? { title: 'asc' } :
        sort === 'title_desc' ? { title: 'desc' } :
          { createdAt: 'desc' };

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          authors: true,
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  @Post()
  async create(dto: CreateBookDto) {
    const authorConnectOrCreate = dto.authorNames.map((name) => ({
      where: { name },
      create: { name },
    }));

    return this.prisma.book.create({
      data: {
        title: dto.title,
        year: dto.year,
        authors: { connectOrCreate: authorConnectOrCreate },
        genres: dto.genreNames
      },
      include: { authors: true },
    });
  }

  @Patch()
  async patch(dto: UpdateBookDto, id: string) {
    const authorConnectOrCreate = dto.authorNames?.map((name) => ({
      where: { name },
      create: { name },
    }));

    console.log("dto in patch", dto);

    return this.prisma.book.update({
      where: { id },
      data: {
        title: dto.title,
        year: dto.year,
        authors: authorConnectOrCreate
          ? { connectOrCreate: authorConnectOrCreate }
          : undefined,
        genres: dto.genreNames
      },
      include: { authors: true },
    });
  }

  @Delete()
  async delete(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }
}
