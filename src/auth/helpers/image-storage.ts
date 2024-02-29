import { diskStorage } from "multer";
import { v4 as uuidV4} from 'uuid';

const fs = require('fs');
// const fileType = require('file-type');
// import {fileTypeFromFile} from 'file-type';

import path = require('path');

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