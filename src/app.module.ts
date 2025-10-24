import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ReservationsModule } from './reservations/reservations.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [PrismaModule, AuthModule, BooksModule, ReservationsModule, AuthorsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
