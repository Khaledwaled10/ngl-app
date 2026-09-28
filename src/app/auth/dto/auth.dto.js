import { z } from "zod";

export const registerDto = z.object({
  email: z.email().toLowerCase().trim(),
  name: z.string().min(2).max(20).trim(),
  password: z.string().min(6).max(16).trim(),
  dob: z.date().optional(),
  gander: z.enum(["male", "female"]).optional(),
});

export const verfiyDto = z.object({
  email: z.email().toLowerCase().trim(),
code:z.string().length(6)
});

export const loginDto = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6).max(16).trim(),
});

export const sentDto = z.object({
  email: z.email().toLowerCase().trim(),
});

export const resetPasswordDto = z.object({
  email: z.email().toLowerCase().trim(),
  code: z.string().length(6),
  newPassword: z.string().min(6).max(16).trim(),
});
