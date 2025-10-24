import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto, LoginDto } from './dto/login-dto';
import { SignupDto } from './dto/signup-dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) { }

  @Post('signup')
  @ApiBody({ type: SignupDto })
  @ApiOkResponse({ type: LoginResponseDto, description: 'Successful signup' })
  async signup(@Body() dto: SignupDto): Promise<LoginResponseDto> {
    const token = (await this.auth.signup(dto.email, dto.password, dto.name)).accessToken;
    return { accessToken: token };
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto, description: 'Successful login' })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    const token = (await this.auth.login(dto.email, dto.password)).accessToken;
    return { accessToken: token };
  }
}
