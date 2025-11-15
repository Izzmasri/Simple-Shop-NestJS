/* eslint-disable prettier/prettier */
import { Controller, Get, Query, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Roles } from 'src/decorators/roles.decorator';
import type { PaginationQueryType } from 'src/types/util.types';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { paginationSchema } from 'src/utils/api.util';

@Controller('transaction')
@Roles('CUSTOMER', 'MERCHANT')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(
    @Req() request: Express.Request,
    @Query(new ZodValidationPipe(paginationSchema)) query: PaginationQueryType,
  ) {
    return this.transactionService.findAllUserTransactions(
      BigInt(request.user!.id),
      query,
    );
  }
}
