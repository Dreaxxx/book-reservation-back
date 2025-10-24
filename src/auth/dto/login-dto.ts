import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: 'john@acme.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'pass1234' })
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @IsString() accessToken: string;
}