import * as z from "zod";

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .max(100, "O título não pode exceder 100 caracteres"),
  description: z
    .string()
    .min(10, "A descrição deve ter pelo menos 10 caracteres"),
  classroom: z.number({
    required_error: "Selecione uma sala de aula",
    invalid_type_error: "Sala de aula inválida",
  }),
  due_date: z
    .date({
      required_error: "A data de entrega é obrigatória",
      invalid_type_error: "Data inválida",
    })
    .refine((date) => date > new Date(), {
      message: "A data de entrega não pode ser no passado",
    }),
});

export type CreateActivityPayload = z.infer<typeof createActivitySchema>;
