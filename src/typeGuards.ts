import * as z from 'zod';

export const RequestErrorBodySchema = z.object({
  errors: z.record(
    z.object({
      code: z.string().optional(),
      message: z.string(),
    })
  ),
});

export type ResponseWithValidationErrorsType = z.infer<
  typeof RequestErrorBodySchema
>;

export function isValidationErrorsBody(
  value: unknown
): value is ResponseWithValidationErrorsType {
  return RequestErrorBodySchema.check(value);
}

export const FileObjectSchema = z.object({
  id: z.number(),
  mime: z.string(),
  name: z.string(),
  size: z.number(),
  url: z.string(),
});

export type FileType = z.infer<typeof FileObjectSchema>;

export function isFileObject(value: unknown): value is FileType {
  return FileObjectSchema.check(value);
}

export function isString(value: unknown): value is string  {
  return typeof value === 'string';
}

export function isNonNullObject(value: unknown): value is object  {
  return typeof value === 'object' && value !== null;
}

export function isNullish(value: unknown): value is null | undefined  {
  return value === null || value === undefined;
}

export function isNullable(value: unknown): value is null  {
  return value === null;
}

export function isNumber(value: unknown): value is number  {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isNotNullish<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export const notEmpty = isNotNullish;

export function isNotFalsy<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return Boolean(value);
}
