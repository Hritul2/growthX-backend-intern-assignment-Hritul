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

export const acceptAssignmentSchema = z.object({
  userId: z.string(),
  adminId: z.string(),
  feedback: z.string().optional(),
});

export const rejectAssignmentSchema = z.object({
  userId: z.string(),
  adminId: z.string(),
  feedback: z.string().optional(),
});

export const addAssignmentSchema = z.object({
  task: z.string(),
  description: z.string(),
  dueDate: z.date(),
  adminId: z.string(),
});
