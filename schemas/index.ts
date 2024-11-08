import { UserRole } from "@prisma/client";
import * as z from "zod";


export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.Administrator, UserRole.User, UserRole.PMD, UserRole.Approver]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterUserSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
  address: z.string().optional(),
  contactNo: z.string().optional(),
  role: z.enum([UserRole.Administrator, UserRole.User, UserRole.PMD, UserRole.Approver]).optional(),
});

export const RegisterTenantSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
  address: z.string().optional(),
  contactNo: z.string().optional(),
  role: z.enum([UserRole.Administrator, UserRole.User, UserRole.PMD, UserRole.Approver]).optional(),
});


export const CreatePropertySchema = z.object({
  propertyCode: z.string().min(1, {
    message: "Property Code is requried."
  }),
  propertyName: z.string().min(1, {
    message: "Property Name is required. "
  }),
  titleNo: z.string().min(1, {
    message: "Title No. is required."
  }),
  lotNo: z.string().min(1, {
    message: "Lot No. is required."
  }),
  address: z.string().min(1, {
    message: "Property Address is required."
  }),
  registeredOwner: z.string().min(1, {
    message: "Registered Owner is required."
  }),
  propertyType: z.string().min(1, {
    message: "Property Type is required."
  }),
  leasableArea: z.string().min(1, {
    message: "Leasable Area is required."
  })
})


