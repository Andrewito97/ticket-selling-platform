import { Controller, Post, Body } from '@nestjs/common';
import { TicketTierService } from './ticket-tier.service';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';

@Controller('ticket-tiers')
export class TicketTierController {
  constructor(private readonly ticketTierService: TicketTierService) {}

  @Post()
  async createTicketTier(
    @Body() ticketTier: CreateTicketTierDto,
  ): Promise<void> {
    await this.ticketTierService.createTicketTier(ticketTier);
  }
}
