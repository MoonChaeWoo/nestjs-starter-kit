import { Controller } from '@nestjs/common';
import { SocketIoService } from './socket-io.service';

@Controller('socket-io')
export class SocketIoController {
  constructor(private readonly socketIoService: SocketIoService) {}
}
