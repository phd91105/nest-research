import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setUp } from './app.service';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { RequestLoggerInterceptor } from './interceptors/logger.interceptor';

async function startApplication(): Promise<void> {
  // Create the Nest application
  const nestApplication = await NestFactory.create(AppModule, { cors: true });

  // Enable global validation pipes
  nestApplication.useGlobalPipes(new ValidationPipe());

  // Enable global interceptors
  nestApplication.useGlobalInterceptors(new RequestLoggerInterceptor());

  // Enable global exceptions
  const { httpAdapter } = nestApplication.get(HttpAdapterHost);
  nestApplication.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Set up Swagger and start the application
  setUp(nestApplication);
}

startApplication();
