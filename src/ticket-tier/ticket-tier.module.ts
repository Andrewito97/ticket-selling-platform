import { Module } from '@nestjs/common';
import { TicketTierController } from './ticket-tier.controller';
import { TicketTierService } from './ticket-tier.service';

@Module({
  controllers: [TicketTierController],
  providers: [TicketTierService],
  exports: [TicketTierService],
})
export class TicketTierModule {}
