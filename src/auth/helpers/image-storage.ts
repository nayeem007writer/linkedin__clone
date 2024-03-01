import { diskStorage } from "multer";
import { v4 as uuidV4} from 'uuid';

const fs = require('fs');
const FileType = require('file-type');
// import {fileTypeFromFile} from 'file-type';

import path = require('path');
import { Observable,from ,of } from "rxjs";
import { switchMap } from 'rxjs/operators';

type ValidFileExtension = 'png' | 'jpg' | 'jpeg';
type ValidMineType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtension: ValidFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMineType: ValidMineType[] = ['image/png', 'image/jpg','image/jpeg'];

export const saveImageToStorages = {
    storage: diskStorage({
        destination: './images/',
        filename: (req, file,cb) =>{
            const fileExtention: string = path.extname(file.originalname);
            const fileName: string = uuidV4() + fileExtention;

            cb(null, fileName)
        },
}),
fileFilter: (req, file, cb) =>{
    const allowedMineTypes: ValidMineType[] = validMineType;
    allowedMineTypes.includes(file.mimetype) ? cb(null,true): cb(null, false);
}
};



export const  isFileExtensionSafe =(fullFilePath: string): Observable<boolean> => {
    return from(FileType.fromFile(fullFilePath)).pipe(
        switchMap( (fileExtensionAndMimeType: any)  => {

            if(!fileExtensionAndMimeType) return of(false)

            const isFileTypeLegit = validFileExtension.includes(fileExtensionAndMimeType.ext);
            const isMimeTypeLegit = validMineType.includes(fileExtensionAndMimeType.mime);
            
            const isFileLegit = isFileTypeLegit && isMimeTypeLegit;

            return of(isFileLegit);
        })
    )
}
export const removeFile = (fullFilePath: string): void => {
    try {
      fs.unlinkSync(fullFilePath);
    } catch (err) {
      console.error(err);
    }
  };