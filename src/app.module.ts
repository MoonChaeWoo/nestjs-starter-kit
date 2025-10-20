import {ClassSerializerInterceptor, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './modules/users/users.module';
import {PostModule} from './modules/post/post.module';
import {AuthModule} from './modules/auth/auth.module';
import {FilesModule} from './modules/files/files.module';
import {ProxyModule} from './modules/proxy/proxy.module';
import {GroupModule} from './modules/group/group.module';
import {RoleModule} from './modules/role/role.module';
import {PermissionModule} from './modules/permission/permission.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {InitialDataDatabaseService} from './config/database/main/initial-data-database.service';
import {ConfigModule} from '@nestjs/config';
import {mainDatabaseConfig} from './config/database/main/database.config';
import {MailerModule} from "@nestjs-modules/mailer";
import {GoogleMailConfig} from "./config/mail/google/smtp.config";
import {MailModule} from './modules/mail/mail.module';
import {ScheduleModule} from "@nestjs/schedule";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {SchedulerModule} from './modules/scheduler/scheduler.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import {DownloadFileMainConfigAsync} from "./config/file/download-file.config";
import {SocketIoModule} from './modules/socket-io/socket-io.module';
import {SseModule} from './modules/sse/sse.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(mainDatabaseConfig),
        MailerModule.forRootAsync(GoogleMailConfig),
        ScheduleModule.forRoot(),
        ServeStaticModule.forRootAsync(DownloadFileMainConfigAsync),
        UsersModule,
        PostModule,
        AuthModule,
        FilesModule,
        ProxyModule,
        GroupModule,
        RoleModule,
        PermissionModule,
        MailModule,
        SchedulerModule,
        SocketIoModule,
        SseModule,
    ],
    controllers: [AppController],
    providers: [AppService, InitialDataDatabaseService, {
        provide : APP_INTERCEPTOR,
        useClass : ClassSerializerInterceptor
    }],
})
export class AppModule {}