import z, { ZodType } from 'zod';
import {
  CreateOrderDTO,
  CreateOrderReturnDTO,
  UpdateOrderStatusDTO,
  UpdateReturnStatusDTO,
} from '../types/order.dto';

export const createOrderDTOValidationSchema = z.array(
  z.object({
    productId: z.number().min(1),
    qty: z.number().min(1),
  }),
) satisfies ZodType<CreateOrderDTO>;

export const createReturnDTOValidationSchema = z.object({
  orderId: z.number().min(1),
  items: z.array(
    z.object({
      productId: z.number().min(1),
      qty: z.number().min(1),
    }),
  ),
}) satisfies ZodType<CreateOrderReturnDTO>;

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum(['PENDING', 'SUCCESS']),
}) satisfies ZodType<UpdateOrderStatusDTO>;

export const updateReturnStatusSchema = z.object({
  status: z.enum(['PICKED', 'REFUND', 'PENDING']),
}) satisfies ZodType<UpdateReturnStatusDTO>;
