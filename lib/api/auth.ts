import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {generateRandomCharacter} from "@/backend/utils";

export type AuthUser = {
  id: string;
  phone: string;
  role: string;
  account_type: string;
  nickname: string | null;
  slug: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  plan: string;
  status: string;
  trial_used: boolean;
};

export async function getRequestUser(): Promise<AuthUser | null> {
  const c = await cookies();
  const token = c.get('token')?.value;
  if (!token) return null;

  const user = await prisma.user.findFirst({
    where: {
      token,
      token_expires: { gt: new Date() },
      status: "active",
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    phone: user.phone,
    role: user.role,
    account_type: user.account_type,
    nickname: user.nickname,
    slug: user.slug,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    plan: user.plan,
    status: user.status,
    trial_used: user.trial_used,
  };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getRequestUser();
  if (!user) {
    throw new AuthError("احراز هویت نشده است", 401);
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    throw new AuthError("دسترسی مدیریتی لازم است", 403);
  }
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number = 401) {
    super(message);
    this.status = status;
  }
}

export function authErrorResponse(e: AuthError) {
  return NextResponse.json({
    message: e.message,
    status: false,
  }, {status: e.status});
}

export async function generateToken(): Promise<string> {
  return generateRandomCharacter(48, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
}

export async function createOrUpdateUser(phone: string, accountType: string = "sazeheman") {
  const phoneStr = String(phone).trim();
  const token = await generateToken();
  const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const existing = await prisma.user.findUnique({ where: { phone: phoneStr } });

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        token,
        token_expires: tokenExpires,
        account_type: accountType,
        status: "active",
      },
    });
    return updated;
  }

  return prisma.user.create({
    data: {
      phone: phoneStr,
      account_type: accountType,
      token,
      token_expires: tokenExpires,
      status: "active",
    },
  });
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV === "development" || process.env.OTP_DEV_MODE === "true";
}

export function sanitizeUser(user: any) {
  const { token, token_expires, ...safe } = user;
  return safe;
}
