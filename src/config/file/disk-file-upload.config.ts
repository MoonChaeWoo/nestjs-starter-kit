import {ConfigModule, ConfigService} from "@nestjs/config";
import {diskStorage} from "multer";
import {extname, join} from "path";
import {v4 as uuid} from "uuid";
import {BadRequestException} from "@nestjs/common";
import {mkdir} from "node:fs/promises";

export const DiskFileUploadConfig = (saveLocation: string, extension?: string[]) => ({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
            destination(req, res, cb){
                const today = new Date();
                const uploadPath = join(
                    process.cwd(),
                    configService.get<string>('FILE_UPLOAD_DIR') || 'upload',
                    saveLocation,
                    today.getFullYear().toString(),
                    String((today.getMonth() + 1)).padStart(2, '0'),
                    String(today.getDate()).padStart(2, '0')
                );

                mkdir(uploadPath, { recursive: true })
                    .then(() => cb(null, uploadPath))
                    .catch(err => cb(err, ''));
            },
            filename(req, file, cb){
                cb(null, `${uuid()}${extname(file.originalname)}`);
            },
        }),
        fileFilter(req, file, callback){
            const allowedExtensions = extension ?? [
                '.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx',
                '.hwp', '.hwpx', '.ppt', '.pptx', '.odt', '.ods',
                '.mp4', '.mov', '.avi', '.mkv', '.wmv', '.zip',
                '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'
            ];
            const fileExt = extname(file.originalname).toLowerCase();

            if (allowedExtensions.includes(fileExt)) {
                callback(null, true);  // 허용
            } else {
                callback(new BadRequestException('허용되지 않은 확장자입니다. 관리자에게 요청하세요.'), false); // 거부
            }
        },
        limits : {
            fileSize: 1024 * 1024 * 100, //최대 100MB
        }
    })
});