/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PaginatedResult, PaginationQueryType } from 'src/types/util.types';
import { Prisma, UserTransaction } from '@generated/prisma';
import { removeFields } from 'src/utils/object.util';
@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: DatabaseService) {}

  async findAllUserTransactions(
    userId: bigint,
    query: PaginationQueryType,
  ): Promise<PaginatedResult<UserTransaction>> {
    return this.prismaService.$transaction(async (prisma) => {
      const pagination = this.prismaService.handleQueryPagination(query);

      const transactions = await prisma.userTransaction.findMany({
        ...removeFields(pagination, ['page']),
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              orderStatus: true,
              createdAt: true,
            },
          },
          orderReturn: {
            select: {
              id: true,
              status: true,
              createdAt: true,
            },
          },
        },
      });

      const count = await prisma.userTransaction.count({
        where: { userId },
      });

      return {
        data: transactions,
        ...this.prismaService.formatPaginationResponse({
          page: pagination.page,
          count,
          limit: pagination.take,
        }),
      };
    });
  }
}
