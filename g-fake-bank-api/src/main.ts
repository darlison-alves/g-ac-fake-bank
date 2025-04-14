import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const options = new DocumentBuilder()
  .setTitle('Fake Bank API')
  .setDescription('The fake bank API description')
  .setVersion('1.0')
  .addTag('bank')
  .addBearerAuth()
  .build();


  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe())
  await app.listen(4000);
}
bootstrap();
