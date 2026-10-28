'use server';
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/api/auth";
import {
  normalizeIranPhone,
  isValidIranPhone,
  requestOtpCode,
  verifyOtpCode,
} from "@/lib/sms";

export async function adminSendCode(phone: string) {
  const normalizedPhone = normalizeIranPhone(phone);
  if (!isValidIranPhone(normalizedPhone)) {
    return { ok: false, message: "شماره تلفن معتبر نیست" };
  }

  const legacyPhoneWithoutZero = normalizedPhone.startsWith("0")
    ? normalizedPhone.slice(1)
    : normalizedPhone;

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
      select: { id: true, phone: true, role: true, status: true },
    });
    if (!user && legacyPhoneWithoutZero !== normalizedPhone) {
      user = await prisma.user.findUnique({
        where: { phone: legacyPhoneWithoutZero },
        select: { id: true, phone: true, role: true, status: true },
      });
    }
  } catch (dbErr: any) {
    console.error(`[ADMIN-OTP][DB ERROR] Failed to query user: ${dbErr?.message?.split("\n")[0]}`);
    return { ok: false, message: "خطا در اتصال به پایگاه داده سرور" };
  }

  if (!user) {
    return { ok: false, message: "حساب کاربری با این شماره یافت نشد" };
  }

  if (user.status === "suspended") {
    return { ok: false, message: "این حساب تعلیق شده است" };
  }

  if (user.role !== "admin") {
    return { ok: false, message: "این شماره به حساب مدیریتی متعلق ندارد" };
  }

  const otpRes = await requestOtpCode(normalizedPhone, "ServerAction:adminSendCode");
  if (!otpRes.ok) {
    return {
      ok: false,
      message: otpRes.message,
      traceId: otpRes.traceId,
      errorCode: otpRes.errorCode,
    };
  }

  return {
    ok: true,
    message: otpRes.message,
    traceId: otpRes.traceId,
  };
}

export async function adminVerifyCode(phone: string, code: string) {
  const normalizedPhone = normalizeIranPhone(phone);
  const codeStr = String(code || "").trim();

  if (!normalizedPhone || !codeStr) {
    return { ok: false, message: "شماره تلفن و کد الزامی است" };
  }

  const legacyPhoneWithoutZero = normalizedPhone.startsWith("0")
    ? normalizedPhone.slice(1)
    : normalizedPhone;

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
      select: { id: true, role: true, status: true, token: true },
    });
    if (!user && legacyPhoneWithoutZero !== normalizedPhone) {
      user = await prisma.user.findUnique({
        where: { phone: legacyPhoneWithoutZero },
        select: { id: true, role: true, status: true, token: true },
      });
    }
  } catch (dbErr: any) {
    console.error(`[ADMIN-OTP][DB ERROR] Failed to query user on verify: ${dbErr?.message?.split("\n")[0]}`);
    return { ok: false, message: "خطا در اتصال به پایگاه داده سرور" };
  }

  if (!user) {
    return { ok: false, message: "حساب کاربری یافت نشد" };
  }

  if (user.role !== "admin") {
    return { ok: false, message: "دسترسی مدیریتی ندارید" };
  }

  if (user.status === "suspended") {
    return { ok: false, message: "این حساب تعلیق شده است" };
  }

  const verification = await verifyOtpCode(normalizedPhone, codeStr, "ServerAction:adminVerifyCode");
  if (!verification.ok) {
    return {
      ok: false,
      message: verification.message,
      traceId: verification.traceId,
      errorCode: verification.errorCode,
    };
  }

  const token = await generateToken();
  const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { phone: normalizedPhone, token, token_expires: tokenExpires, status: "active" },
  });

  const c = await cookies();
  c.set("token", token, {
    path: "/",
    expires: tokenExpires,
    httpOnly: true,
    sameSite: "lax",
  });

  return { ok: true, message: "ورود موفقیت‌آمیز بود", traceId: verification.traceId };
}

export async function adminLogout() {
  const c = await cookies();
  const token = c.get('token')?.value;
  if (token) {
    await prisma.user.updateMany({
      where: { token },
      data: { token: null, token_expires: null },
    }).catch(() => {});
  }
  c.delete("token");
  return true;
}
