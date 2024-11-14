import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { TransformationInterceptor } from './responseInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT // Get the port from .env file

  app.use(cookieParser());// Add cookie parser for managing cookies
  app.setGlobalPrefix(process.env.APP_PREFIX)
  app.useGlobalInterceptors(new TransformationInterceptor);
  await app.listen(PORT, () => {
    console.log(`Server is running on port:  ${PORT}`);
    
  });
}
bootstrap();
