import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from '../config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config.PREFIX);
  const documentOptions = new DocumentBuilder()
      .setTitle(config.TITLE)
      .setDescription(config.DESCRIPTION)
      .setVersion(config.VERSION)
      .build();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup(config.API_EXPLORER_PATH, app, document);
  await app.listen(config.PORT);
}
bootstrap();
