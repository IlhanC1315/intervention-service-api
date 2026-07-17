import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { InvitationModule } from './invitation/invitation.module';
import { InterventionModule } from './intervention/intervention.module';
import { ReportModule } from './report/report.module';
import { CommentModule } from './comment/comment.module';
import { AttachmentModule } from './attachment/attachment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // disponible dans tous les modules
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    CompanyModule,
    UserModule,
    CustomerModule,
    InvitationModule,
    InterventionModule,
    ReportModule,
    CommentModule,
    AttachmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}