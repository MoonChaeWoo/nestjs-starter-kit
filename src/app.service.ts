import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NestJS Starter Kit</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #89f7fe, #66a6ff);
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
    
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px) saturate(180%);
          -webkit-backdrop-filter: blur(15px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
          padding: 40px;
          width: 400px;
          text-align: center;
          color: #fff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
    
        .glass-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.3);
        }
    
        h1 {
          font-size: 2rem;
          margin-bottom: 10px;
        }
    
        p {
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 20px;
        }
    
        a.button {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.3);
          color: #fff;
          text-decoration: none;
          font-weight: bold;
          transition: background 0.3s ease;
        }
    
        a.button:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      </style>
    </head>
    <body>
      <div class="glass-card">
        <h1>NestJS Starter Kit</h1>
        <p>
            빠르게 NestJS 프로젝트를 시작하고 싶은 개발자를 위해 만들어진 스타터 킷입니다.<br>
            기본 구조, 인증 기능, 모듈화 설계를 갖추고 있어
            개발자는 복잡한 초기 설정 없이 핵심 기능 개발에 집중할 수 있습니다.
        </p>
        <a href="https://github.com/MoonChaeWoo/nestjs-starter-kit.git" target="_blank" class="button">GitHub 바로가기</a>
      </div>
    </body>
    </html>
    `;
  }
}
