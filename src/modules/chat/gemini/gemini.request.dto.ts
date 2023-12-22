import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const mimeTypeEnum = z.enum([
  'image/png',
  'image/jpeg',
  'video/mov',
  'video/mpeg',
  'video/mp4',
  'video/mpg',
  'video/avi',
  'video/wmv',
  'video/mpegps',
  'video/flv',
])

const videoMetadataSchema = z.object({
  startOffset: z.object({
    seconds: z.number().int(),
    nanos: z.number().int().optional(),
  }),
  endOffset: z.object({
    seconds: z.number().int(),
    nanos: z.number().int().optional(),
  }),
})

const inlineDataSchema = z.object({
  mimeType: mimeTypeEnum,
  data: z.string(),
})

const fileDataSchema = z.object({
  mimeType: mimeTypeEnum,
  fileUri: z.string(),
})

const partSchema = z
  .object({
    text: z.string().optional(),
    inlineData: inlineDataSchema.optional(),
    fileData: fileDataSchema.optional(),
    videoMetadata: videoMetadataSchema.optional(),
  })
  .refine(
    (data) => {
      // Ensure only one of the optional fields is provided
      const keys = ['text', 'inlineData', 'fileData', 'videoMetadata']
      return keys.filter((key) => data[key] !== undefined).length === 1
    },
    {
      message:
        "Only one of 'text', 'inlineData', 'fileData', 'videoMetadata' should be provided",
    },
  )

const roleEnum = z.enum(['USER', 'MODEL'])

const contentSchema = z.object({
  role: roleEnum,
  parts: z.array(partSchema),
})

const functionParameterSchema = z.any() // Replace with OpenAPI Object Schema if available

const functionDeclarationSchema = z.object({
  name: z.string().max(64),
  description: z.string().optional(),
  parameters: functionParameterSchema,
})

const toolSchema = z.object({
  functionDeclarations: z.array(functionDeclarationSchema),
})

const harmCategoryEnum = z.enum([
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_DANGEROUS_CONTENT',
])

const harmBlockThresholdEnum = z.enum([
  'BLOCK_NONE',
  'BLOCK_LOW_AND_ABOVE',
  'BLOCK_MED_AND_ABOVE',
  'BLOCK_HIGH_AND_ABOVE',
])

const safetySettingSchema = z.object({
  category: harmCategoryEnum,
  threshold: harmBlockThresholdEnum,
})

const generationConfigSchema = z.object({
  temperature: z.number().min(0).max(1),
  topP: z.number().min(0).max(1).optional(),
  topK: z.number().int().min(1).max(40).optional(),
  candidateCount: z.literal(1),
  maxOutputTokens: z.number().int().min(1).max(2048),
  stopSequences: z.array(z.string()).max(5),
})

const GeminiRequestSchema = z.object({
  contents: z.array(contentSchema),
  tools: z.array(toolSchema).optional(),
  safetySettings: z.array(safetySettingSchema).optional(),
  generationConfig: generationConfigSchema,
})

export class GeminiRequestDto extends createZodDto(GeminiRequestSchema) {}
export type TGeminiRequest = z.infer<typeof GeminiRequestSchema>
