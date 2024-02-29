import { Controller, Request,Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorages } from '../helpers/image-storage';
import { of } from 'rxjs';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorages))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): any {
        const filename = file?.filename;

        if(!filename) return of({error: 'File must be a png. jpg/jpeg'});
    }
}
