import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import  * as fs from "fs";
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a',
})
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes( new ValidationPipe())
  app.use(morgan('combined', { stream: logStream}))

  const config = new DocumentBuilder()
  .setTitle('Your API Title')
  .setDescription('Your API description')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
