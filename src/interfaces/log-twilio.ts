import { z } from 'zod';
import { ClienteSchema } from './cliente';

export const TwilioMessageStatusSchema = z.enum([
  'queued',
  'sending',
  'sent',
  'failed',
  'delivered',
  'undelivered',
  'receiving',
  'received',
  'accepted',
  'scheduled',
  'read',
  'partially_delivered',
  'canceled',
]);
export type TwilioMessageStatus = z.infer<typeof TwilioMessageStatusSchema>;

export const TwilioMessageDirectionSchema = z.enum([
  'inbound',
  'outbound-api',
  'outbound-call',
  'outbound-reply',
]);
export type TwilioMessageDirection = z.infer<
  typeof TwilioMessageDirectionSchema
>;

export const LogTwilioSchema = z
  .object({
    _id: z.string(),
    fechaCreacion: z.string().optional().meta({ 'x-bson': 'date' }),
    idCliente: z
      .string()
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    idsAncestros: z
      .array(z.string())
      .optional()
      .meta({ 'x-bson': 'objectId', 'x-ref': 'ClienteSchema' }),
    phone: z.string().optional(),
    sid: z.string().optional(),
    body: z.string().optional(),
    direction: TwilioMessageDirectionSchema.optional(),
    status: TwilioMessageStatusSchema.optional(),
    error: z.boolean().optional(),
    /// Solo en error
    errorCode: z.string().optional(),
    errorMessage: z.string().optional(),
    // Populate
    cliente: ClienteSchema.optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idCliente',
        foreignField: '_id',
        justOne: true,
      },
    }),
    ancestros: z.array(ClienteSchema).optional().meta({
      'x-populate': {
        ref: 'ClienteSchema',
        localField: 'idsAncestros',
        foreignField: '_id',
        justOne: false,
      },
    }),
  })
  .meta({ 'x-collection': 'logtwilios' });
export type ILogTwilio = z.infer<typeof LogTwilioSchema>;

////// CREATE
export const CreateLogTwilioSchema = LogTwilioSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type ICreateLogTwilio = z.infer<typeof CreateLogTwilioSchema>;

////// UPDATE
export const UpdateLogTwilioSchema = LogTwilioSchema.omit({
  _id: true,
  fechaCreacion: true,
  cliente: true,
});
export type IUpdateLogTwilio = z.infer<typeof UpdateLogTwilioSchema>;
