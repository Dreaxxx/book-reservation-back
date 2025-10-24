import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateReservationDto {
    @ApiProperty({
        example: 'book-uuid-1234',
    })
    @IsString()
    bookId!: string;

    @ApiProperty({
        example: 'user-uuid-5678',
    })
    @IsString()
    reservedBy!: string;

    @ApiProperty({
        example: '2024-07-15T10:00:00Z',
    })
    @IsString()
    dueDate!: string;
}
