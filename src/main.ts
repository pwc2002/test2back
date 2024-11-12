import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://port-next-test2-m3ecwpb257a84dfd.sel4.cloudtype.app/'
    ],
    credentials: true,
  })
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
