import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getIndex() {
      return {
          title : 'NestJS Starter Kit',
          layout : 'main/layouts/layout-full'
      };
  }
}
