import {ServeStaticModuleOptions} from "@nestjs/serve-static";
import {join} from "path";
import {ServeStaticModuleAsyncOptions} from "@nestjs/serve-static/dist/interfaces/serve-static-options.interface";
import {ConfigModule, ConfigService} from "@nestjs/config";

export interface ServeStaticOptionsAsync extends ServeStaticModuleAsyncOptions {
    rootPath: string;
    serveRoot: string;
}


export interface ServeStaticOptions extends ServeStaticModuleOptions {
    rootPath: string;
    serveRoot: string;
}

export const DownloadFileMainConfigAsync: ServeStaticModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ([
        {
            rootPath : join(process.cwd(), configService.get<string>('FILE_UPLOAD_DIR') || 'upload'),
            serveRoot : configService.get<string>('FILE_DOWNLOAD_URL_PREFIX') || '/upload'
        }
    ])
};

export const DownloadFileConfigAsync = (options: ServeStaticOptionsAsync[]) : ServeStaticModuleAsyncOptions => ({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        return options.map(value => {
            const {rootPath, serveRoot} = value;

            return {
                rootPath : join(process.cwd(), rootPath),
                //rootPath : join(process.cwd(), configService.get<string>('FILE_DOWNLOAD_URL_PREFIX') || 'upload'),
                serveRoot,
            };
        });
    }
});


export const DownloadFileConfig = (options: ServeStaticOptions[]) : ServeStaticModuleOptions[] => (
    options.map(value => {
        const {rootPath, serveRoot} = value;

        return {
            rootPath : join(process.cwd(), rootPath),
            serveRoot,
        };
    })
);