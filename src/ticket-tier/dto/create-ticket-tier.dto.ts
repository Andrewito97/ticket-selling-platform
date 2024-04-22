import { IsDecimal, ValidateIf } from 'class-validator';

export class CreateTicketTierDto {
  @IsDecimal()
  @ValidateIf((dto) => typeof dto.promoterReceivesPrice === 'undefined')
  buyerPrice?: string;

  @IsDecimal()
  @ValidateIf((dto) => typeof dto.buyerPrice === 'undefined')
  promoterReceivesPrice?: string;
}
