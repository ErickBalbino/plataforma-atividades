import * as z from "zod";

export const submissionSchema = z.object({
  content: z
    .string()
    .min(10, "A resposta deve ter pelo menos 10 caracteres")
    .max(5000, "A resposta está muito longa"),
});

export type SubmissionPayload = z.infer<typeof submissionSchema>;

export const gradeSubmissionSchema = z.object({
  grade: z
    .number({
      required_error: "A nota é obrigatória",
      invalid_type_error: "A nota deve ser um número",
    })
    .min(0, "A nota mínima é 0")
    .max(10, "A nota máxima é 10"),
  feedback: z.string().optional(),
});

export type GradeSubmissionPayload = z.infer<typeof gradeSubmissionSchema>;
