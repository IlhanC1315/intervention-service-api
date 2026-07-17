import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Module({
  controllers: [AuthController],
  imports: [PassportModule, JwtModule.register({secret: process.env.JWT_SECRET, signOptions: { expiresIn: '7d' }})],
  providers: [AuthService]
})
export class AuthModule {}
