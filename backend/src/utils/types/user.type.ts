import * as z from "zod";

export const userRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userTokenSchema = z.object({
  userId: z.string(),
});

export const uploadAssignmentSchema = z.object({
  userId: z.string(),
  submitText: z.string(),
  admin: z.string(),
  assignmentId: z.string(),
});
