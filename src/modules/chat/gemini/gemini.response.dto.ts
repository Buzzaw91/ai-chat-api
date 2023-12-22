import { z } from 'zod'

const finishReasonEnum = z.enum([
  'FINISH_REASON_UNSPECIFIED',
  'FINISH_REASON_STOP',
  'FINISH_REASON_MAX_TOKENS',
  'FINISH_REASON_SAFETY',
  'FINISH_REASON_RECITATION',
  'FINISH_REASON_OTHER',
])

const harmCategoryEnum = z.enum([
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_DANGEROUS_CONTENT',
])

const harmProbabilityEnum = z.enum([
  'HARM_PROBABILITY_UNSPECIFIED',
  'NEGLIGIBLE',
  'LOW',
  'MEDIUM',
  'HIGH',
])

const roleEnum = z.enum(['model'])

const safetyRatingSchema = z.object({
  category: harmCategoryEnum,
  probability: harmProbabilityEnum,
  blocked: z.boolean(),
})

const citationMetadataSchema = z.object({
  citations: z.array(
    z.object({
      startIndex: z.number().int(),
      endIndex: z.number().int(),
      uri: z.string(),
      title: z.string(),
      license: z.string(),
      publicationDate: z.object({
        year: z.number().int(),
        month: z.number().int().optional(),
        day: z.number().int().optional(),
      }),
    }),
  ),
})

const partSchema = z.object({
  text: z.string(),
})

const contentSchema = z.object({
  role: roleEnum,
  parts: z.array(partSchema),
})

const candidateSchema = z.object({
  content: contentSchema,
  finishReason: finishReasonEnum,
  safetyRatings: z.array(safetyRatingSchema),
  citationMetadata: citationMetadataSchema.optional(),
})

const usageMetadataSchema = z.object({
  promptTokenCount: z.number().int(),
  candidatesTokenCount: z.number().int(),
  totalTokenCount: z.number().int(),
})

const GeminiResponseSchema = z.object({
  candidates: z.array(candidateSchema),
  usageMetadata: usageMetadataSchema,
})

export type TGeminiResponse = z.infer<typeof GeminiResponseSchema>
