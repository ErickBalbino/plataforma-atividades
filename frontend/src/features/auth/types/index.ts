import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: number;
  email: string;
  role: "TEACHER" | "STUDENT";
  classroom_name?: string;
}
