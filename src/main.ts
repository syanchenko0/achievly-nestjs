import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupSwagger } from '@/app/helpers/swagger.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  setupSwagger(app);

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  return port;
}

bootstrap().then((port) => console.log(`Server started on port ${port}`));
