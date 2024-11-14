import { Module } from '@nestjs/common';
import { JwtModule } from '@/modules/jwt/jwt.module';
import { AuthController } from '@/modules/auth/auth.controller';
import { UserRepo } from '@/modules/prisma/repositories/user.repo';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserRepo],
})
export class AuthModule {}
