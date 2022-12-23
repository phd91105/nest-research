import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto, RefreshTokenDto, RegiterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() user: LoginDto): Promise<Record<string, string>> {
    return this.authService.authenticateUser(user);
  }

  @Post('register')
  @ApiBody({ type: RegiterDto })
  async register(
    @Body() user: RegiterDto,
  ): Promise<Record<string, string | number>> {
    return this.authService.register(user);
  }

  @Post('refresh')
  @ApiBody({ type: RefreshTokenDto })
  async refresh(
    @Body('refreshToken') refreshToken: string,
  ): Promise<Record<string, string>> {
    const accessToken = await this.authService.refresh(refreshToken);
    return { accessToken, refreshToken };
  }
}
