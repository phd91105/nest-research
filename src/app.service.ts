import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfiguration } from './config/app.config';

export const setUp = async (
  nestApplication: INestApplication,
): Promise<void> => {
  // Configure the Swagger document builder
  const swaggerDocumentBuilderOptions = new DocumentBuilder()
    .setTitle('nest-research')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  // Create the Swagger document
  const swaggerDocument = SwaggerModule.createDocument(
    nestApplication,
    swaggerDocumentBuilderOptions,
  );

  // Set up Swagger
  SwaggerModule.setup('docs', nestApplication, swaggerDocument);

  // Start the application
  await nestApplication.listen(AppConfiguration.port);
};
