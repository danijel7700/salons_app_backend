import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from './enums/environment.enum';
import { MongoExceptionFilter } from './exceptionFilters/mongoExceptionFilters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>(AvailableConfigs.APP_PORT) || 3000;

  app.useGlobalFilters(new MongoExceptionFilter());
  app.enableCors();

  await app.listen(port);
}
bootstrap();
