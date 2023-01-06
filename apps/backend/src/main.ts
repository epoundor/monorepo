import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { ReadTerritory, transformer } from 'src/core/territory/transformer';

// ReadTerritory();
// transformer();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('PREUVE DE VIE')
    .setDescription('ENPOINTS DU PROJET "PREUVE DE VIE"')
    .setBasePath('api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3008);
}
bootstrap();
