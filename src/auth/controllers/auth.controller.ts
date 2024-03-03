import { Body, Controller, Post } from '@nestjs/common';
import { User } from '../models/user.interface';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @Post('register')
    @ApiOperation({ summary: 'Sign Up' })
    @ApiResponse({ status: 200, description: 'user created' })
    register(@Body() user: User): Observable<User> {
        console.log(user.role);
        return this.authService.registerAccount(user);
    }

    @Post('login')
    login(@Body() user: User):Observable<{token: string}> {
        return this.authService.login(user)
        .pipe(map((jwt: string) =>({token: jwt})));
        
    }
}

