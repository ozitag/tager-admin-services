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
