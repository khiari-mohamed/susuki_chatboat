import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import type { AuthenticatedAdminUser } from './jwt.strategy';

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Public — this is the only unauthenticated route in the /admin space.
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthenticatedAdminUser) {
    return this.authService.me(user.id);
  }
}
