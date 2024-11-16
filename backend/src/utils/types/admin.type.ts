import * as z from "zod";

export const adminRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  department: z.enum(["HR", "IT", "FINANCE", "MARKETING"]),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const adminTokenSchema = z.object({
  adminId: z.string(),
});
