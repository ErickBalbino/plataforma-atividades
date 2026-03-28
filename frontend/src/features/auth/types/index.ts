import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  classroom?: number;
}
