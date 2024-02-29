import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entities';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn: "3600s"},
      })
      
    }),
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [AuthService, JwtGuard, JwtStrategy, RolesGuard, UserService, UserService],
  controllers: [AuthController, UserController],
  exports: [AuthService, UserService]
})
export class AuthModule {}
