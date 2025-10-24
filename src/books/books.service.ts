import { Delete, Get, Injectable, Patch, Post } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { SearchBooksDto } from "./dto/search-book-dto";

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) { }

  async findOne(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { authors: true, genres: true },
    });
  }

  async findAll() {
    return this.prisma.book.findMany({
      include: { authors: true, genres: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async search(dto: SearchBooksDto) {
    const { querySting, genre, autor, page = 1, pageSize = 10, sort = "newest" } = dto;

    const where: any = {};

    if (autor) {
      where.authors = { some: { name: { equals: autor, mode: "insensitive" } } };
    }
    else if (genre) {
      where.genres = { some: { name: { equals: genre, mode: "insensitive" } } };
    }

    if (querySting) {
      const qLike = { contains: querySting, mode: "insensitive" };
      where.OR = [
        { title: qLike },
        { authors: { some: { name: qLike } } },
        { genres: { some: { name: qLike } } },
      ];
    }
    // sort by title or createdAt date if no sort is specified
    const orderBy: Prisma.BookOrderByWithRelationInput =
      sort === "title_asc" ? { title: "asc" } :
        sort === "title_desc" ? { title: "desc" } :
          { createdAt: "desc" };

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { authors: true, genres: true },
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

    const genreConnectOrCreate = dto.genreNames.map((name) => ({
      where: { name },
      create: { name },
    }));

    return this.prisma.book.create({
      data: {
        title: dto.title,
        year: dto.year,
        authors: { connectOrCreate: authorConnectOrCreate },
        genres: { connectOrCreate: genreConnectOrCreate },
      },
      include: { authors: true, genres: true },
    });
  }

  @Patch()
  async patch(dto: UpdateBookDto, id: string) {
    const authorConnectOrCreate = dto.authorNames?.map((name) => ({
      where: { name },
      create: { name },
    }));

    const genreConnectOrCreate = dto.genreNames?.map((name) => ({
      where: { name },
      create: { name },
    }));

    return this.prisma.book.update({
      where: { id },
      data: {
        title: dto.title,
        year: dto.year,
        authors: authorConnectOrCreate
          ? { connectOrCreate: authorConnectOrCreate }
          : undefined,
        genres: genreConnectOrCreate
          ? { connectOrCreate: genreConnectOrCreate }
          : undefined,
      },
      include: { authors: true, genres: true },
    });
  }

  @Delete()
  async delete(id: string) {
    return this.prisma.book.delete({ where: { id } });
  }
}
