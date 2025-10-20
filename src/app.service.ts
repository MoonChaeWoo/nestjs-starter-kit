import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIndex() {
      return {
          title : 'NestJS Starter Kit',
          layout : 'main/layouts/layout-minimal'
      };
  }

    getSocket() {
        return {
            title : 'NestJS Starter Kit',
            layout : 'socket/layouts/layout-full'
        };
    }
}
