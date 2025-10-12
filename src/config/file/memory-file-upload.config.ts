import {memoryStorage} from "multer";
import {BadRequestException} from "@nestjs/common";
import {extname} from "path";

export const MemoryFileUploadConfig = (extension?: string[]) => ({
    storage: memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 100,
    },
    fileFilter(req, file, cb){
        const allowedExtensions = extension ?? [
            '.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx',
            '.hwp', '.hwpx', '.ppt', '.pptx', '.odt', '.ods',
            '.mp4', '.mov', '.avi', '.mkv', '.wmv', '.zip',
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'
        ];
        const fileExt = extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(fileExt)) {
            cb(null, true);  // 허용
        } else {
            cb(new BadRequestException('허용되지 않은 확장자입니다. 관리자에게 요청하세요.'), false); // 거부
        }
    }
});