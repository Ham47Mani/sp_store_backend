import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransormationInterceptor } from './responseInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT // Get the port from .env file

  app.useGlobalInterceptors(new TransormationInterceptor());
  await app.listen(PORT, () => {
    console.log(`Server is running on port:  ${PORT}`);
    
  });
}
bootstrap();
