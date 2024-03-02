import { Controller, Request, Post, UploadedFile, UseGuards, UseInterceptors, Get, Res, Param, Put, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorages } from '../helpers/image-storage';
import { Observable, of, switchMap } from 'rxjs';
import { join } from 'path';
import { User } from '../models/user.interface';
import { FriendRequest, FriendRequestStatus, FriendRequest_Status } from '../models/friend.request.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorages))
  uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): any {
    const filename = file?.filename;

    if (!filename) return of({ error: 'File must be a png. jpg/jpeg' });

    const imageFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imageFolderPath + '/' + file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;
          return this.userService.updateUserImageById(userId, filename);
        }
        removeFile(fullImagePath)
        return of({ error: "File content does not match extention" });
      })
    )

  }

  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Request() req, @Res() res): Observable<Object> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  findUserById(@Param('userId') userStringId: string): Observable<User> {
    const userId = parseInt(userStringId);
    return this.userService.findUserById(userId);
  }

  @UseGuards(JwtGuard)
  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Request() req,
    @Param('receiverId') receiverStringId: string,
  ): Observable<FriendRequest | { error: string }> {
    const receiverId = parseInt(receiverStringId);
    return this.userService.sendFriendRequest(receiverId, req.user);
  }

  @UseGuards(JwtGuard)
  @Put('friend-request/response/:friendRequestId')
  responseToFriendRequest(
    @Body() statusResponse: FriendRequestStatus,
    @Param('receiverId') friendRequestStringId: string
  ): Observable<FriendRequestStatus> {
    const friendRequestId = parseInt(friendRequestStringId);
    return this.userService.responseToFriendRequest(statusResponse, friendRequestId);
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Request() req: any,
    @Param('receiverId') receiverStringId: string
  ): Observable<FriendRequestStatus> {
    const receiverId = parseInt(receiverStringId);
    return this.userService.getFriendRequestStatus(receiverId, req.user);
  }


  @UseGuards(JwtGuard)
  @Get('friend-request/me/receiver')
  getFriendRequestsFromRecipients(
    @Request() req,
  ): Observable<FriendRequest []> {
    return this.userService.getFriendRequestsFromRecipients(req.user);
  }

}
