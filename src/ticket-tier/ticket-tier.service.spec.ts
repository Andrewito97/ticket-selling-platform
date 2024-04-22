import { Test, TestingModule } from '@nestjs/testing';
import { TicketTierService } from './ticket-tier.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TicketTierService', () => {
  let ticketTierService: TicketTierService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketTierService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue({
        feeSettings: {
          findFirstOrThrow: jest
            .fn()
            .mockResolvedValue({ serviceFeeRate: 10, minimumFee: 1 }),
        },
        ticketTier: {
          create: jest.fn(),
        },
      })
      .compile();

    ticketTierService = module.get<TicketTierService>(TicketTierService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should fail if both buyerPrice & promoterReceivesPrice are given', async () => {
    const ticketTier = { buyerPrice: '20', promoterReceivesPrice: '10' };

    await expect(
      ticketTierService.createTicketTier(ticketTier),
    ).rejects.toThrow(
      'Please enter either buyerPrice or promoterReceivesPrice',
    );
  });

  it('should fail if calculated serviceFee is less then minimal', async () => {
    const ticketTier = { buyerPrice: '2' };

    await expect(
      ticketTierService.createTicketTier(ticketTier),
    ).rejects.toThrow(
      'Calculated service fee is 0.2 which is less than minimum 1',
    );
  });

  it('should calculate price fields correctly if buyerPrice given', async () => {
    const ticketTier = { buyerPrice: '20' };
    const createTicketTier = jest.spyOn(prismaService.ticketTier, 'create');

    await ticketTierService.createTicketTier(ticketTier);

    expect(createTicketTier).toHaveBeenCalledWith({
      data: {
        buyerPrice: 20,
        promoterReceivesPrice: 18,
        serviceFee: 2,
      },
    });
  });

  it('should calculate price fields correctly if promoterReceivesPrice given', async () => {
    const ticketTier = { promoterReceivesPrice: '10' };
    const createTicketTier = jest.spyOn(prismaService.ticketTier, 'create');

    await ticketTierService.createTicketTier(ticketTier);

    expect(createTicketTier).toHaveBeenCalledWith({
      data: {
        buyerPrice: 11,
        promoterReceivesPrice: 10,
        serviceFee: 1,
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
