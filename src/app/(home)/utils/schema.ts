import z from "zod/v4";

export const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createTenantSchema = z.object({
  name: z.string().min(1, "Tenant name is required"),
  users: z.array(userSchema).min(1, "At least one user is required"),
});
