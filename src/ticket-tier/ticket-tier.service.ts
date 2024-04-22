import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketTierDto } from './dto/create-ticket-tier.dto';

type CreateTicketTier = {
  serviceFee: number;
  buyerPrice: number;
  promoterReceivesPrice: number;
};

@Injectable()
export class TicketTierService {
  constructor(private prisma: PrismaService) {}

  async createTicketTier(data: CreateTicketTierDto): Promise<void> {
    if (data.buyerPrice && data.promoterReceivesPrice) {
      throw new ConflictException(
        'Please enter either buyerPrice or promoterReceivesPrice',
      );
    }

    const buyerPrice = Number(data.buyerPrice);
    const promoterReceivesPrice = Number(data.promoterReceivesPrice);
    const settings = await this.prisma.feeSettings.findFirstOrThrow();
    const minimumFee = Number(settings.minimumFee);
    const ticketTier: CreateTicketTier = {
      serviceFee: 0,
      buyerPrice: 0,
      promoterReceivesPrice: 0,
    };

    if (buyerPrice) {
      const serviceFee = Number(buyerPrice) * (settings.serviceFeeRate / 100);

      if (serviceFee < minimumFee) {
        throw new UnprocessableEntityException(
          `Calculated service fee is ${serviceFee} which is less than minimum ${settings.minimumFee}`,
        );
      }

      ticketTier.serviceFee = serviceFee;
      ticketTier.buyerPrice = buyerPrice;
      ticketTier.promoterReceivesPrice = buyerPrice - serviceFee;
    }

    if (promoterReceivesPrice) {
      // Assuming that if no buyer price received - we use minimal fee
      ticketTier.serviceFee = minimumFee;
      ticketTier.buyerPrice = minimumFee + promoterReceivesPrice;
      ticketTier.promoterReceivesPrice = promoterReceivesPrice;
    }

    await this.prisma.ticketTier.create({ data: ticketTier });
  }
}
