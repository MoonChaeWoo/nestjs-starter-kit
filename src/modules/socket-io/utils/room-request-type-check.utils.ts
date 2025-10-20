import {WsException} from "@nestjs/websockets";

export const roomsTransform = (rooms: (string | number)[] | string): string | string[] => {
    if(!rooms) throw new WsException('socket.io의 들어갈 room의 이름을 넣어야합니다.');

    if(typeof rooms === 'string' && /[\[\]]/.test(rooms) ){
        rooms = JSON.parse(rooms.replace(/["|']/g, '')).map(String);
        return rooms as string[];
    }else if(typeof rooms === 'string'){
        return rooms.replace(/["|']/g, '');
    }else if(typeof rooms === 'object'){
        return rooms?.map(String);
    }else{
        return String(rooms);
    }
};