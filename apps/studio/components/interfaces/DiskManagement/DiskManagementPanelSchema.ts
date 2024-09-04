import { z } from 'zod'

const baseSchema = z.object({
  storageType: z.enum(['io2', 'gp3']).describe('Type of storage: io2 or gp3'),
  allocatedStorage: z
    .number()
    .min(8, { message: 'Allocated storage must be at least 8 GiB for gp3' })
    .max(16384, { message: 'Allocated storage must not exceed 16 TiB for gp3' })
    .describe('Allocated storage size in GiB'),
  provisionedIOPS: z
    .number()
    .min(3000, { message: 'Provisioned IOPS must be at least 3000 for gp3' })
    .max(16000, { message: 'Provisioned IOPS must not exceed 16000 for gp3' })
    .describe('Provisioned IOPS for gp3'),
  throughput: z
    .number()
    .min(125, { message: 'Throughput must be at least 125 MiBps for gp3' })
    .max(1000, { message: 'Throughput must not exceed 1000 MiBps for gp3' })
    .optional()
    .describe('Throughput in MiBps for gp3'),
})

export const DiskStorageSchema = baseSchema.superRefine((data, ctx) => {
  const { storageType, allocatedStorage, provisionedIOPS, throughput } = data

  if (storageType === 'io2') {
    // Validation rules for io2
    if (allocatedStorage < 8 || allocatedStorage > 16384) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Allocated storage must be between 8 GiB and 16 TiB for io2.',
        path: ['allocatedStorage'],
      })
    }
    if (provisionedIOPS < 100 || provisionedIOPS > 256000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provisioned IOPS must be between 100 and 256,000 for io2.',
        path: ['provisionedIOPS'],
      })
    }
    if (throughput !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Throughput is not configurable for io2.',
        path: ['throughput'],
      })
    }
  } else if (storageType === 'gp3') {
    // Validation rules for gp3
    if (allocatedStorage < 8 || allocatedStorage > 16384) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Allocated storage must be between 8 GiB and 16 TiB for gp3.',
        path: ['allocatedStorage'],
      })
    }
    if (provisionedIOPS < 3000 || provisionedIOPS > 16000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provisioned IOPS must be between 3000 and 16000 for gp3.',
        path: ['provisionedIOPS'],
      })
    }
    if (allocatedStorage < 400 && throughput !== 125) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Throughput must be 125 MiBps for allocated storage less than 400 GiB for gp3.',
        path: ['throughput'],
      })
    } else if (
      allocatedStorage >= 400 &&
      throughput !== undefined &&
      (throughput < 125 || throughput > 1000)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Throughput must be between 125 and 1000 MiBps for allocated storage >= 400 GiB for gp3.',
        path: ['throughput'],
      })
    }
  }
})

export type DiskStorageSchemaType = z.infer<typeof DiskStorageSchema>
