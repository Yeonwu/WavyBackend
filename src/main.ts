import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const corsOrigins: Array<string> = process.env.CORS_ORIGINS.split(' ');
    const corsHeaders: Array<string> = process.env.CORS_HEADERS.split(' ');
    const corsMethods: Array<string> = process.env.CORS_METHODS.split(' ');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.enableCors({
        origin: corsOrigins,
        methods: corsMethods,
    });

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Wavy API')
        .setDescription(
            `
        Wavy API 문서
        
        일련번호, ID, Seq 등은 모두 같은 뜻입니다.
        `,
        )
        .setVersion('0.1')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'JWT token을 입력해주세요',
                in: 'header',
            },
            'access-token',
        )
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, swaggerDocument);

    await app.listen(3000);
}
bootstrap();
