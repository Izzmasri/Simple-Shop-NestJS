import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/decorators/roles.decorator';
import type {
  CreateOrderDTO,
  CreateOrderResponseDTO,
  CreateOrderReturnDTO,
  OrderOverviewResponseDTO,
  OrderResponseDTO,
} from './types/order.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createOrderDTOValidationSchema,
  createReturnDTOValidationSchema,
} from './util/order.validation.schema';
import { paginationSchema } from 'src/utils/api.util';
import type {
  PaginatedResult,
  PaginationQueryType,
} from 'src/types/util.types';
import { Patch } from '@nestjs/common';
import {
  updateOrderStatusSchema,
  updateReturnStatusSchema,
} from './util/order.validation.schema';
import type {
  UpdateOrderStatusDTO,
  UpdateReturnStatusDTO,
} from './types/order.dto';

@Controller('order')
@Roles(['CUSTOMER'])
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createOrderDTOValidationSchema))
    createOrderDto: CreateOrderDTO,

    @Req() request: Express.Request,
  ): Promise<CreateOrderResponseDTO> {
    return this.orderService.create(createOrderDto, BigInt(request.user!.id));
  }

  @Get()
  findAll(
    @Req() request: Express.Request,

    @Query(new ZodValidationPipe(paginationSchema))
    query: PaginationQueryType,
  ): Promise<PaginatedResult<OrderOverviewResponseDTO>> {
    return this.orderService.findAll(BigInt(request.user!.id), query);
  }
  // Admin: Update order status
  @Patch(':id/status')
  @Roles('ADMIN')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateOrderStatusSchema))
    updateData: UpdateOrderStatusDTO,
  ): Promise<OrderResponseDTO> {
    return this.orderService.updateOrderStatus(Number(id), updateData);
  }

  // Admin: Update return status
  @Patch('return/:returnId/status')
  @Roles('ADMIN')
  async updateReturnStatus(
    @Param('returnId') returnId: string,
    @Body(new ZodValidationPipe(updateReturnStatusSchema))
    updateData: UpdateReturnStatusDTO,
  ): Promise<OrderResponseDTO> {
    return this.orderService.updateReturnStatus(Number(returnId), updateData);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() request: Express.Request,
  ): Promise<OrderResponseDTO> {
    return this.orderService.findOne(+id, BigInt(request.user!.id));
  }

  // returns end points

  // create return
  @Post('return')
  createReturn(
    @Body(new ZodValidationPipe(createReturnDTOValidationSchema))
    createReturnDto: CreateOrderReturnDTO,
    @Req() request: Express.Request,
  ): Promise<OrderResponseDTO> {
    return this.orderService.createReturn(
      createReturnDto,
      BigInt(request.user!.id),
    );
  }
}
