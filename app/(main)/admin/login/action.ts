'use server';
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken, isDevMode } from "@/lib/api/auth";

export async function adminSendCode(phone: string) {
  const phoneStr = String(phone).trim();

  if (!phoneStr || phoneStr.length < 10) {
    return { ok: false, message: "شماره تلفن معتبر نیست" };
  }

  const user = await prisma.user.findUnique({
    where: { phone: phoneStr },
    select: { id: true, role: true, status: true },
  });

  if (!user) {
    return { ok: false, message: "حساب کاربری با این شماره یافت نشد" };
  }

  if (user.status === "suspended") {
    return { ok: false, message: "این حساب تعلیق شده است" };
  }

  if (user.role !== "admin") {
    return { ok: false, message: "این شماره به حساب مدیریتی متعلق ندارد" };
  }

  const oneMinuteAgo = new Date(Date.now() - 60_000);
  const recent = await prisma.smsCode.findFirst({
    where: { phone: phoneStr, created_at: { gte: oneMinuteAgo } },
    orderBy: { created_at: "desc" },
  });

  if (recent) {
    return { ok: false, message: "کد قبلی هنوز منقضی نشده است. یک دقیقه صبر کنید." };
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await prisma.smsCode.create({
    data: { phone: phoneStr, code, expires_at: expiresAt },
  });

  const dev = isDevMode();
  if (dev) {
    console.log(`[ADMIN-LOGIN-DEV] OTP for ${phoneStr}: ${code}`);
  } else {
    const smsUrl = process.env.SMS_API_URL;
    const smsApiKey = process.env.SMS_API_KEY;
    if (smsUrl && smsApiKey) {
      try {
        await fetch(smsUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${smsApiKey}`,
          },
          body: JSON.stringify({
            phone: phoneStr,
            message: `کد تایید ورود مدیر: ${code}`,
          }),
        });
      } catch (e) {
        console.error("[ADMIN-LOGIN SMS] Failed to send:", e);
      }
    } else {
      console.warn("[ADMIN-LOGIN SMS] No SMS gateway configured.");
    }
  }

  return {
    ok: true,
    message: "کد تایید ارسال شد",
    ...(dev ? { dev_code: code } : {}),
  };
}

export async function adminVerifyCode(phone: string, code: string) {
  const phoneStr = String(phone).trim();
  const codeStr = String(code).trim();

  if (!phoneStr || !codeStr) {
    return { ok: false, message: "شماره تلفن و کد الزامی است" };
  }

  const user = await prisma.user.findUnique({
    where: { phone: phoneStr },
    select: { id: true, role: true, status: true, token: true },
  });

  if (!user) {
    return { ok: false, message: "حساب کاربری یافت نشد" };
  }

  if (user.role !== "admin") {
    return { ok: false, message: "دسترسی مدیریتی ندارید" };
  }

  if (user.status === "suspended") {
    return { ok: false, message: "این حساب تعلیق شده است" };
  }

  const dev = isDevMode();

  if (!dev) {
    const now = new Date();
    const latestCode = await prisma.smsCode.findFirst({
      where: {
        phone: phoneStr,
        used: false,
        expires_at: { gt: now },
      },
      orderBy: { created_at: "desc" },
    });

    if (!latestCode) {
      return { ok: false, message: "کد معتبر نیست یا منقضی شده است" };
    }

    if (latestCode.attempts >= 5) {
      await prisma.smsCode.update({
        where: { id: latestCode.id },
        data: { used: true },
      });
      return { ok: false, message: "تعداد تلاش‌ها بیش از حد مجاز است" };
    }

    if (latestCode.code !== codeStr) {
      await prisma.smsCode.update({
        where: { id: latestCode.id },
        data: { attempts: { increment: 1 } },
      });
      return { ok: false, message: "کد اشتباه است" };
    }

    await prisma.smsCode.update({
      where: { id: latestCode.id },
      data: { used: true },
    });
  }

  const token = await generateToken();
  const tokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { token, token_expires: tokenExpires, status: "active" },
  });

  const c = await cookies();
  c.set("token", token, {
    path: "/",
    expires: tokenExpires,
    httpOnly: true,
    sameSite: "lax",
  });

  return { ok: true, message: "ورود موفقیت‌آمیز بود" };
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
