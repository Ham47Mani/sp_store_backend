import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransormationInterceptor } from './responseInterceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT // Get the port from .env file

  app.use(cookieParser());// Add cookie parser for managing cookies
  app.setGlobalPrefix(process.env.APP_PREFIX)
  await app.listen(PORT, () => {
    console.log(`Server is running on port:  ${PORT}`);
    
  });
}
bootstrap();
