import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "O nome precisa ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["TEACHER", "STUDENT"], {
    errorMap: () => ({ message: "O papel deve ser selecionado" }),
  }),
});

export type RegisterCredentials = z.infer<typeof registerSchema>;

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  name: string;
}
