import {Controller, Get, Render} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('main/index')
  getIndex() {
    return this.appService.getIndex();
  }

    @Get('socket-test')
    @Render('socket/index')
    getSocket() {
        return this.appService.getSocket();
    }
}
