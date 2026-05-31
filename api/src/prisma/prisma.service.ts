import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}

//Prisma client permet d'heriter de toutes ses methodes
//onModuleInit nestJs appelle cette methode au demarrage de l'appli
//pour se connecter a la base de données
//OnModuleDestroy cette methode permet l'arret se deconnecter proprement
