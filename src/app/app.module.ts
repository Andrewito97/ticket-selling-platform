import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketTierModule } from 'src/ticket-tier/ticket-tier.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, TicketTierModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
