import { BadRequestException, Delete, Get, Injectable, InternalServerErrorException, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RESERVATION_SELECT } from './sql/select-factorised';
import { Prisma } from '@prisma/client';


@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) { }

  @Get()
  async findAll() {
    const reservations = await this.prisma.reservation.findMany({
      select: RESERVATION_SELECT,
    });

    return reservations;
  }

  @Get(':id')
  async findOne(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      select: RESERVATION_SELECT,
    });

    return reservation;
  }

  @Post()
  async create(dto: CreateReservationDto, userId: string) {
    try {
      if (!userId) throw new UnauthorizedException('Missing userId');
      if (!dto?.bookId) throw new BadRequestException('bookId is required');
      if (!dto?.dueDate) throw new BadRequestException('dueDate is required');

      return await this.prisma.$transaction((tx) =>
        tx.reservation.create({
          data: {
            book: { connect: { id: dto.bookId } },
            reservedBy: { connect: { id: userId } },
            dueDate: new Date(dto.dueDate),
          },
          select: RESERVATION_SELECT,
        }),
      );
    } catch (e: any) {
      const code = e?.meta?.code ?? e?.code;
      const msg = String(e?.meta?.message || e?.message || '');
      const isConstraint =
        (typeof code === 'string' && code.startsWith('23')) ||
        msg.includes('book_reservation_no_overlap');

      if (isConstraint) {
        throw new BadRequestException(
          'Time slot not available, overlaps with existing reservation',
        );
      }
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  @Patch(':id')
  async patch(id: string, dto: UpdateReservationDto) {
    const data: Prisma.ReservationUpdateInput = {};

    if (dto.dueDate !== undefined) {
      data.dueDate = new Date(dto.dueDate);
    }

    return this.prisma.reservation.update({
      where: { id },
      data,
      select: RESERVATION_SELECT,
    });
  }

  @Delete(':id')
  async delete(id: string) {
    return this.prisma.reservation.delete({
      where: { id },
    });
  }
}
