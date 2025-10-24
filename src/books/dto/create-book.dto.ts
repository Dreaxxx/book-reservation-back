import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Reservation } from "../../reservations/entities/reservation.entity";

export class CreateBookDto {
    @IsString()
    title!: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    year?: number;

    @IsArray()
    @IsString({ each: true })
    authorNames!: string[];

    @IsArray()
    @IsString({ each: true })
    genreNames!: string[];

    @IsOptional()
    @IsString()
    reservation?: Reservation;
}
