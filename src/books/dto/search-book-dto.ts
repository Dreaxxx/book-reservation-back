import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class SearchBooksDto {
    @IsOptional()
    @IsString()
    @Transform(({ value, obj }) => (value ?? obj.searchQuery ?? '').trim() || undefined)
    querySting?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    genre?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value, obj }) => (value ?? obj.author ?? '').trim() || undefined)
    autor?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    pageSize?: number = 10;

    @IsOptional()
    @IsString()
    sort?: "title_asc" | "title_desc" | "unknown";
}
