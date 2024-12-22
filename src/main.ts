import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Packing Lists API')
    .setDescription('API for managing packing lists and items')
    .setVersion('1.0')
    .addTag('packing-lists')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`App started listening on port: ${port}`);
}
bootstrap();
