import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService] //permet au autres modules de l'utiliser donc se co a la bdd
})
export class PrismaModule {}
