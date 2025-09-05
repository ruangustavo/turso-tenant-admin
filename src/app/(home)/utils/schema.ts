import z from "zod/v4";

export const userSchema = z.object({
  username: z.string().min(1, "Username é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const createTenantSchema = z.object({
  name: z.string().min(1, "Nome do tenant é obrigatório"),
  users: z.array(userSchema).min(1, "Pelo menos um usuário é obrigatório"),
});
