import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Reservation } from "../../reservations/entities/reservation.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateBookDto {
    @ApiProperty({
        example: 'Harry Potter and the Philosopher\'s Stone',
    })
    @IsString()
    title!: string;

    @ApiProperty({
        example: 1998,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    year?: number;

    @ApiProperty({
        example: ['J.K. Rowling'],
    })
    @IsArray()
    @IsString({ each: true })
    authorNames!: string[];

    @ApiProperty({
        example: ['Fantasy', 'Adventure'],
    })
    @IsArray()
    @IsString({ each: true })
    genreNames!: string[];
}
