import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConf = configService.get('app');
  const nodeConf = configService.get('node');

  app.useLogger([appConf.logLevel]);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []): BadRequestException => {
        const errors = validationErrors.map((error) => {
          return {
            property: error.property,
            constraints: Object.values(error.constraints || {}),
          };
        });

        return new BadRequestException(JSON.stringify(errors));
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  if (nodeConf.mode === 'development') {
    const params = new DocumentBuilder()
      .setTitle('test-case-zftf')
      .setDescription('')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, params);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(appConf.port);
}
bootstrap();
