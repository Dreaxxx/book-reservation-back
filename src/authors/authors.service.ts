import { BadRequestException, Delete, Get, Injectable, Patch, Post } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private prisma: PrismaService) { }

  @Get()
  findAll() {
    return this.prisma.author.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  findOne(id: string) {
    return this.prisma.author.findUnique({
      where: { id },
    });
  }

  @Post()
  async create(dto: CreateAuthorDto) {
    if (!dto?.name?.trim()) {
      throw new BadRequestException('Name is required');
    }

    return this.prisma.author.create({
      data: {
        name: dto.name
      },
    });
  }

  @Patch(':id')
  async patch(dto: UpdateAuthorDto, id: string) {
    if (!dto?.name?.trim()) {
      throw new BadRequestException('Name is required');
    }

    return this.prisma.author.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  @Delete(':id')
  async delete(id: string) {
    return this.prisma.author.delete({
      where: { id },
    });
  }
}
