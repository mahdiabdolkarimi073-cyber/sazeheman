import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {generateRandomCharacter} from "@/backend/utils";
import {normalizeIranPhone, isValidIranPhone, maskPhone} from "@/lib/sms";

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

const globalForAuthUsers = globalThis as unknown as {
  __sazehemanMemoryUsers?: Map<string, any>;
};

function getMemoryUsers(): Map<string, any> {
  if (!globalForAuthUsers.__sazehemanMemoryUsers) {
    globalForAuthUsers.__sazehemanMemoryUsers = new Map();
  }
  return globalForAuthUsers.__sazehemanMemoryUsers;
}

export async function getRequestUser(): Promise<AuthUser | null> {
  const c = await cookies();
  const token = c.get('token')?.value;
  if (!token) return null;

  try {
    const user = await prisma.user.findFirst({
      where: {
        token,
        token_expires: { gt: new Date() },
        status: "active",
      },
    });

    if (user) {
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
  } catch {
    for (const u of getMemoryUsers().values()) {
      if (u.token === token && u.token_expires > new Date() && u.status === "active") {
        return u;
      }
    }
  }

  return null;
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
  const normalizedPhone = normalizeIranPhone(phone);
  if (!isValidIranPhone(normalizedPhone)) {
    throw new AuthError("شماره موبایل معتبر نیست", 400);
  }

  const legacyPhoneWithoutZero = normalizedPhone.startsWith("0")
    ? normalizedPhone.slice(1)
    : normalizedPhone;

  const token = await generateToken();
  const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  try {
    let existing = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
    if (!existing && legacyPhoneWithoutZero !== normalizedPhone) {
      existing = await prisma.user.findUnique({ where: { phone: legacyPhoneWithoutZero } });
    }

    if (existing) {
      if (existing.status === "suspended") {
        throw new AuthError("این حساب کاربری تعلیق شده است", 403);
      }

      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          phone: normalizedPhone,
          token,
          token_expires: tokenExpires,
          account_type: accountType || existing.account_type,
          status: "active",
        },
      });
      return updated;
    }

    return await prisma.user.create({
      data: {
        phone: normalizedPhone,
        account_type: accountType,
        token,
        token_expires: tokenExpires,
        status: "active",
      },
    });
  } catch (err: any) {
    if (err instanceof AuthError) throw err;
    console.warn(
      `[AUTH][DB-FALLBACK] Prisma user upsert failed for ${maskPhone(normalizedPhone)} (${
        err?.message?.split("\n")[0] || "DB unreachable"
      }). Using in-memory user session.`
    );
    const mem = getMemoryUsers();
    const existingMem = mem.get(normalizedPhone);
    const now = new Date();
    const record = {
      id: existingMem?.id || `mem-${Date.now()}`,
      phone: normalizedPhone,
      role: existingMem?.role || "user",
      account_type: accountType || existingMem?.account_type || "sazeheman",
      nickname: existingMem?.nickname || null,
      slug: existingMem?.slug || null,
      first_name: existingMem?.first_name || null,
      last_name: existingMem?.last_name || null,
      email: existingMem?.email || null,
      plan: existingMem?.plan || "free",
      status: existingMem?.status || "active",
      trial_used: existingMem?.trial_used || false,
      token,
      token_expires: tokenExpires,
      created_at: existingMem?.created_at || now,
      updated_at: now,
    };
    mem.set(normalizedPhone, record);
    return record;
  }
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.OTP_DEV_MODE === "true";
}

export function sanitizeUser(user: any) {
  const { token, token_expires, ...safe } = user;
  return safe;
}
