'use server'

import {  CreatePropertySchema,  NewPasswordSchema, RegisterTenantSchema, RegisterUserSchema, ResetSchema, SettingsSchema } from "@/schemas";
import { prisma } from "@/lib/db";
import {  getUserByEmail, getUserById } from "@/data/user";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getVerificationTokenByToken } from "@/data/verificiation-token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { currentUser } from "@/lib/auth";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";

  export const settings = async (
    values: z.infer<typeof SettingsSchema>
  ) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unauthorized" }
    }
  
    const dbUser = await getUserById(user.id);
  
    if (!dbUser) {
      return { error: "Unauthorized" }
    }
  
    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }
  
    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);
  
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" }
      }
  
      const verificationToken = await generateVerificationToken(
        values.email
      );
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );
  
      return { success: "Verification email sent!" };
    }
  
    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password,
      );
  
      if (!passwordsMatch) {
        return { error: "Incorrect password!" };
      }
  
      const hashedPassword = await bcrypt.hash(
        values.newPassword,
        10,
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }
  
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      }
    });
  
    return { success: "Settings Updated!" }
  }

  export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid emaiL!" };
    }
  
    const { email } = validatedFields.data;
  
    const existingUser = await getUserByEmail(email);
  
    if (!existingUser) {
      return { error: "Email not found!" };
    }
  
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
  
    return { success: "Reset email sent!" };
  }

  export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
  
    if (!existingToken) {
      return { error: "Token does not exist!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
  
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
  
    const existingUser = await getUserByEmail(existingToken.email);
  
    if (!existingUser) {
      return { error: "Email does not exist!" };
    }
  
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { 
        emailVerified: new Date(),
        email: existingToken.email,
      }
    });
  
    await prisma.verificationToken.delete({
      where: { id: existingToken.id }
    });
  
    return { success: "Email verified!" };
  };
  

  export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema> ,
    token?: string | null,
  ) => {
    if (!token) {
      return { error: "Missing token!" };
    }
  
    const validatedFields = NewPasswordSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { password } = validatedFields.data;
  
    const existingToken = await getPasswordResetTokenByToken(token);
  
    if (!existingToken) {
      return { error: "Invalid token!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
  
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
  
    const existingUser = await getUserByEmail(existingToken.email);
  
    if (!existingUser) {
      return { error: "Email does not exist!" }
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });
  
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  
    return { success: "Password updated!" };
  };


