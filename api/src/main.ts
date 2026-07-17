import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Securité Helmet renvoie un headers http en cachant des informations sensibles
  app.use(helmet())
  // Performance Compression compresse les reponses http donc plus rapide
  app.use(compression());
  // CORS autorise le front end a appeler l'api
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Préfixe global pour toutes les routes
  app.setGlobalPrefix('api');

  // Validation globale - active les DTOs sur toutes les routes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non définis dans le DTO 
      forbidNonWhitelisted: true, // erreur si champ inconnu envoyé 
      transform: true // transforme automatiquement les données
    })
  );

  //Arret propre de l'application
  app.enableShutdownHooks();

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Intervio API')
    .setDescription('API de gestion d\'interventions pour PME')
    .setVersion('1.0')
    .setContact('Intervio', 'https://intervio.fr', 'contact@intervio.fr')
    .addServer('http://localhost:3000', 'Developpement')
    .addServer('https://api.intervio.fr', 'Production')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Entrez votre JWT token'
    }) // Ajoute l'authentification JWT dans Swagger
    .addTag('Auth', 'Authentification et gestion des accès')
    .addTag('Company', 'Gestion de l\'entreprise')
    .addTag('User', 'Gestion des utilisateurs')
    .addTag('Customer', 'Gestion des clients')
    .addTag('Intervention', 'Gestion des interventions')
    .addTag('Report', 'Comptes rendus techniciens')
    .addTag('Comment', 'Commentaires')
    .addTag('Attachment', 'Pièces jointes')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: false,
    })

  const port = process.env.PORT ?? 3000
  await app.listen(port);

  console.log(`Intervio API lancée sur http://localhost:${process.env.PORT}/api`);
  console.log(`Documentation Swagger : http://localhost:${port}/docs`);
}
bootstrap();
