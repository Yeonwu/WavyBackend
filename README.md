<div align=center>

<img width="200px" src="https://user-images.githubusercontent.com/26461307/139542520-eb45acd7-48fa-4189-a39e-f10d058c70c8.png"/> <br/>

# Wavy - API Server

인공지능 기반의 맞춤형 K-POP 댄스 학습 서비스

</div>

<div align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#features">Features</a> •
  <a href="#developer">Developer</a>
</div>

<br/><br/><br/><br/><br/>

## Introduction

<div align="left">

<img alt="Npm" src="https://img.shields.io/badge/-NPM-CB3837?style=flat-square&logo=npm&logoColor=white" />
<img alt="NestJS" src="https://img.shields.io/badge/-NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" />
<img alt="TypeORM" src="https://img.shields.io/badge/-TypeORM-ff6a00?style=flat-square&logo=typeorm&logoColor=white" />
<img alt="Prettier" src="https://img.shields.io/badge/-Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white" />
<img alt="PostgreSQL" src="https://img.shields.io/badge/-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=white" />
<img  src="https://img.shields.io/badge/AWS S3-569A31?style=flat-square&logo=amazon-s3&logoColor=white" />
<img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/>
<img alt="ESLint" src="https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white" />
<img alt="pm2" src="https://img.shields.io/badge/-PM2-2B037A?style=flat-square&logo=pm2&logoColor=white" />
<img  src="https://img.shields.io/badge/AWS SDK-232F3E?style=flat-square&logo=amazon-aws&logoColor=white" />

</div>

**Wavy** API 서버는 NestJS를 기반으로 위 개발 스택을 사용하여 개발되었습니다.

## Getting Started

[**Wavy**](https://www.wavy.dance)는 [www.wavy.dance](https://www.wavy.dance)에서 만나보실 수 있습니다. <br>
Swagger로 작성된 [API 문서](https://api.prod.wavy.dance/api/docs)는 [api.prod.wavy.dance/api/docs](https://api.prod.wavy.dance/api/docs)에서 확인하실 수 있습니다.

### Project Clone

```bash
git clone https://github.com/EO2-WAVY/WavyBackend.git
```

### Install Packages

```bash
npm insall
```

### Environment

실행할 환경에 알맞은 파일명으로 환경변수를 세팅해주세요.

개발용 환경변수 파일명 : `.env.dev`  
테스트용 환경변수 파일명 : `.env.test`  
운영용 환경변수 파일명 : `.env.prod`

```bash
DB_HOST=[DB 호스트]
DB_PORT=[DB 포트]
DB_USER=[DB User]
DB_PW=[DB Password]
DB_NAME=[DB명]

SECRET_KEY=[JWT 암호화에 사용되는 키]

SYSTEM_MBR_SEQ=[시스템 유저 일련번호]

KAKAO_LOGIN_HOST=kauth.kakao.com
KAKAO_LOGOUT_HOST=kapi.kakao.com
KAKAO_CLIENT_ID=[카카오 클라이언트 아이디]
KAKAO_GRANT_TYPE=authorization_code

AWS_REGION=[AWS 리전]
AWS_PROFILE=[AWS Profile명]
AWS_PRIVATE_KEY_LOCATION=[Cloud Front 접근용 ssh키 파일 경로]

AWS_USER_VIDEO_UPLOAD_S3_BUCKET=[사용자 녹화 영상 업로드 버킷명]
AWS_USER_VIDEO_CF_ENDPOINT=[사용자 녹화 영상 Cloud Front 엔드포인트 URL]
AWS_USER_VIDEO_CONVERTED_BUCKET=[변환 완료된 사용자 녹화 영상 버킷명]

AWS_USER_IMAGE_S3_BUCKET = [사용자 프로필 이미지 버킷명]
DEFAULT_USER_IMAGE = [사용자 기본 이미지 S3 키]

AWS_AN_JSON_BUCKET_ENDPOINT=[분석 결과 JSON 버킷 엔드포인트 URL]
AWS_EXT_JSON_BUCKET_ENDPOINT=[학습용 영상 JSON 버킷 엔드포인트 URL]

# 각 힝목은 ' '으로 구분합니다.
# ex) http://localhost:3000 https://wavy.dance https://www.wavy.dance
CORS_ORIGINS=[CORS Allowed Origins]
CORS_METHODS=[CORS Allowed Methods]
CORS_HEADERS=[CORS Allowed Headers]

USER_VIDEO_ANALYST_REQ_URL=[사용자 영상 분석 요청 API URL]
```

### 어플리케이션 실행

```bash
# Run as devleopment
npm run start:dev

# Run as test
npm run start:test

#Run as production
npm run start:prod
```

## Features

### Config

NestJS의 Config Module과 Joi의 Validation 기능을 이용해 설정을 관리하고 있습니다. NODE_ENV의 값에 알맞은 환경변수 파일을 자동으로 불러와 사용합니다.

[src/app.module.ts](./src/app.module.ts) line 44

```typescript
ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: getEnvFilePath(process.env.NODE_ENV),
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('dev', 'test', 'prod').required(),

                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USER: Joi.string().required(),
                DB_PW: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                ...
```

### ORM

TypeORM 모듈을 사용해 DB를 ORM 방식으로 관리합니다. Swagger에 표시되는 API 프로퍼티에 대한 설명도 함께 관리합니다.

[src/members/entities/members.entity.ts](./src/members/entities/members.entity.ts) line 45

```typescript
@Entity()
@Unique(['mbrKakaoSeq'])
export class Member extends CoreEntity {
    @PrimaryGeneratedColumn({ name: 'mbr_seq', type: 'bigint' })
    @IsNumberString()
    @ApiProperty({ name: 'mbrSeq', description: '회원 일련번호', type: String })
    mbrSeq: string;

    @Column({ name: 'mbr_email', type: 'varchar', length: 255 })
    @ApiProperty({ description: '회원 이메일', type: String })
    @IsEmail()
    mbrEmail: string;
    ...
```

### Authentication

Kakao OAuth를 사용해 로그인하고 JWT로 사용자를 인증합니다. MiddleWare를 사용하여 Authorization 헤더를 파싱하고 Guard를 사용해 API에 대한 접근 권한을 관리합니다.

[src/auth/auth.service.ts](./src/auth/auth.service.ts) line 44

```typescript
// Jwt 발급 코드
const { code, redirectUrl } = getJwtInput;
const kakaoTokens = await this.getKakaoToken(code, redirectUrl);
const mbrKakaoSeq = await this.getMbrKakaoSeq(kakaoTokens.accessToken);
const { member } = await this.memberService.getMemberByKakaoSeq(mbrKakaoSeq);

const jwtToken = this.createJwt(
    member?.mbrSeq,
    kakaoTokens.accessToken,
    this.UnixEpochTimestamp() + kakaoTokens.expiresIn,
);

return { ok: true, token: jwtToken };
```

[src/auth/auth-jwt.middleware.ts](./src/auth/auth-jwt.middleware.ts) line 18

```typescript
// Authorization 헤더 파싱 코드
const token = req.headers['authorization'].toString().split(' ')[1];
const decoded = this.jwtService.verify(token);

if (typeof decoded === 'object') {
    req.headers['x-jwt-decoded'] = JSON.stringify(decoded);
    if (decoded.hasOwnProperty('mbrSeq')) {
        const member = await this.member.findOne({
            mbrSeq: decoded.mbrSeq,
        });

        if (!member) {
            throw new Error(`Cannot find Member by mbrSeq(${decoded.mbrSeq}).`);
        }
        req.headers['x-member'] = JSON.stringify(member);
    }
}
```

### Analysis

사용자 영상 분석과정은 다음과 같습니다.

1. AWS S3 Signed URL을 사용해 사용자 영상 업로드  
   [src/aws/aws-user-video.service.ts](src/aws/aws-user-video.service.ts) line 46

```typescript
const bucket = this.config.get('AWS_USER_VIDEO_UPLOAD_S3_BUCKET');
const s3ObjectName = await this.getS3ObjectName(bucket);
const contentType = 'video/webm';

const signedUrl = await this.getS3SignedUrl(
    bucket,
    s3ObjectName,
    contentType,
    'putObject',
);

return { ok: true, s3ObjectName, signedUrl };
```

2. AWS Lambda에 영상 포맷 변환 요청
3. [MachineLearningAPIServer](https://github.com/EO2-WAVY/WavyMachineLearningApiServer)에 분석 요청  
   [src/analyses/analyses.service.ts](./src/analyses/analyses.service.ts) line 293

```typescript
const response = await this.registerAnalysisInQueue(
    savedAnalysis,
    refVideo,
    jwt,
    mirrorEffect,
);

if (response) {
    newAnalysis.anStatusCode = AnalysisStatusCode.PROCESSING;
    await this.analyses.save(newAnalysis);
} else {
    newAnalysis.anStatusCode = AnalysisStatusCode.FAIL;
    await this.analyses.save(newAnalysis);
    return { ok: false, error: '분석 요청에 실패했습니다.' };
}
```

4. [MachineLearningAPIServer](https://github.com/EO2-WAVY/WavyMachineLearningApiServer)에서 분석 완료시 분석 완료 API를 호출

### Directory Structure

```bash
src
├── [Module Name]
│   └── dtos
│       └── *.dto.ts
│   └── entities (optional)
│       └── *.entity.ts
│   └── *.service.ts
│   └── *.controller.ts
│   └── *.module.ts
├── .env
├── app.module.ts
└── main.ts


```

### Packages

```bash
├── @nestjs/cli@8.1.1
├── @nestjs/common@8.0.6
├── @nestjs/config@1.0.1
├── @nestjs/core@8.0.6
├── @nestjs/jwt@8.0.0
├── @nestjs/mapped-types@1.0.0
├── @nestjs/platform-express@8.0.6
├── @nestjs/schematics@8.0.3
├── @nestjs/swagger@5.0.9
├── @nestjs/testing@8.0.6
├── @nestjs/typeorm@8.0.2
├── @types/express@4.17.13
├── @types/jest@27.0.1
├── @types/node@16.7.10
├── @types/supertest@2.0.11
├── @typescript-eslint/eslint-plugin@4.30.0
├── @typescript-eslint/parser@4.30.0
├── aws-cloudfront-sign@2.2.0
├── aws-sdk@2.997.0
├── camelcase-keys@7.0.0
├── class-transformer@0.4.0
├── class-validator@0.13.1
├── cross-env@7.0.3
├── eslint-config-prettier@8.3.0
├── eslint-plugin-prettier@3.4.1
├── eslint@7.32.0
├── got@11.8.2
├── jest@27.1.0
├── joi@17.4.2
├── nest-aws-sdk@2.0.0
├── pg@8.7.1
├── pm2@5.1.2
├── prettier@2.3.2
├── reflect-metadata@0.1.13
├── rimraf@3.0.2
├── rxjs@7.3.0
├── supertest@6.1.6
├── swagger-ui-express@4.1.6
├── ts-jest@27.0.5
├── ts-loader@9.2.5
├── ts-node@10.2.1
├── tsconfig-paths@3.11.0
├── typeorm@0.2.37
└── typescript@4.4.2
```

## Developer

해당 프로젝트는 [소프트웨어 마에스트로](https://www.swmaestro.org/sw/main/main.do) 사업의 지원을 받아 개발되었습니다.

|                               FE: [hyesungoh](https://github.com/hyesungoh)                               |                              AI: [haeseoklee](https://github.com/haeseoklee)                              |                                  BE: [Yeonwu](https://github.com/Yeonwu)                                  |
| :-------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| <img src="https://avatars.githubusercontent.com/u/26461307?v=4" width="70px" style="border-radius:50%" /> | <img src="https://avatars.githubusercontent.com/u/20268101?v=4" width="70px" style="border-radius:50%" /> | <img src="https://avatars.githubusercontent.com/u/61102178?v=4" width="70px" style="border-radius:50%" /> |

## License

Wavy는 [MIT](https://choosealicense.com/licenses/mit/)라이선스를 따릅니다.
