import {All, Controller, Ip, Req, Res} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import type { Request, Response } from 'express';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

    @All()
    proxyRequest(
        @Req() req: Request,
        @Res() res: Response,
    ){
      return this.proxyService.proxyRequest(req, res);
    }
}
