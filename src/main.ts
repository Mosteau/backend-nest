import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprimer les propriétés non définies dans le DTO pour sécuriser
      forbidNonWhitelisted: true, // rejette la requête si propriété inconnues (erreur 400)
      transform: true, // convertit automatiquementles types (exemple "true" -> boolean)
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
