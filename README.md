<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest 로고" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">
  효율적이고 확장 가능한 서버 사이드 애플리케이션을 구축하기 위한 
  <a href="http://nodejs.org" target="_blank">Node.js</a> 기반의 진보적인 프레임워크입니다.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM 버전" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="패키지 라이선스" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM 다운로드 수" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI 빌드 상태" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Open Collective 후원자" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Open Collective 스폰서" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="PayPal 후원"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="후원하기"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Twitter 팔로우"></a>
</p>

---

## 📘 설명

빠르게 NestJS 프로젝트를 시작하고 싶은 개발자를 위해 만들어진 스타터 킷입니다.<br>
기본 구조, 인증 기능, 모듈화 설계를 갖추고 있어
개발자는 복잡한 초기 설정 없이 핵심 기능 개발에 집중할 수 있습니다.
---

## 🚀 프로젝트 컴파일 및 실행 (도커 사용 시)
```bash
# 도커 컴포즈 사용 시 .env 파일만 수정 시 바로 사용 가능
# .env.example -> .env로 변경 또는 생성 필수
$ docker compose up -d

# 컨테이너 이름 - 버전
# 1. backend - NestJs version 11.0.10
# 2. nginx - Nginx version latest
# 3. db - postgresql16-3.4
# 위 3개 컨테이너 구성으로 서비스를 바로 이용 가능
```
## ⚙️ 프로젝트 설정

```bash
$ npm install
```

---
## 🚀 프로젝트 컴파일 및 실행 (도커 미사용 시)

```bash
# 개발 환경
$ npm run start

# 실시간 변경 감지 모드
$ npm run start:dev

# 운영(프로덕션) 모드
$ npm run start:prod
```

---

## 🚀  Starter Kit API DOCS
프로젝트를 실행 후 api-docs로 접속하면 Api 문서를 볼 수 있습니다.
- 도커 사용 시 : 기본포트 (80)
- NestJS Starter Kit API 문서 (http://localhost:80/api-docs)

- 도커 미사용 시 : 기본포트(3000)
- NestJS Starter Kit API 문서 (http://localhost:3000/api-docs)

---

## 🧪 테스트 실행

```bash
# 단위 테스트
$ npm run test

# E2E 테스트
$ npm run test:e2e

# 테스트 커버리지 확인
$ npm run test:cov
```

---

## ☁️ 배포

NestJS 애플리케이션을 프로덕션 환경에 배포할 준비가 되었다면,  
효율적인 실행을 위해 몇 가지 핵심 단계를 수행해야 합니다.  
자세한 내용은 [배포 문서](https://docs.nestjs.com/deployment)를 참고하세요.

클라우드 기반 플랫폼에서 NestJS 애플리케이션을 배포하려면,  
공식 배포 플랫폼인 [Mau](https://mau.nestjs.com)를 확인해 보세요.  
Mau는 AWS 위에서 NestJS 애플리케이션을 쉽고 빠르게 배포할 수 있도록 도와줍니다.

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

Mau를 사용하면 몇 번의 명령만으로 애플리케이션을 배포할 수 있습니다.  
인프라 관리보다는 기능 개발에 집중할 수 있습니다.

---

## 📚 참고 자료

NestJS를 사용할 때 도움이 될 수 있는 자료들입니다:

- [NestJS 공식 문서](https://docs.nestjs.com)
- [NestJS Mau](https://mau.nestjs.com)를 이용해 AWS에 손쉽게 배포
- [NestJS Devtools](https://devtools.nestjs.com)로 실시간 애플리케이션 그래프 시각화

## 📄 라이선스

Nest Starter Kit은 [MIT 라이선스](https://github.com/nestjs/nest/blob/master/LICENSE)를 따릅니다.
