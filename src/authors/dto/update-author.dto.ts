import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorDto } from './create-author.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
    @ApiProperty({
        example: 'J.K. Rowling',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name!: string;
}
