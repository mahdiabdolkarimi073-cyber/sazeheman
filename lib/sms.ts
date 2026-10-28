import crypto from "crypto";
import dotenv from "dotenv";
import { prisma } from "@/lib/prisma";

// Ensure .env is loaded in all server runtime contexts
dotenv.config({ quiet: true } as any);

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export const OTP_TTL_SECONDS = 120;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const OTP_RATE_LIMIT_MAX_REQUESTS = 5;
export const SMSIR_REQUEST_TIMEOUT_MS = 15_000; // 15 seconds timeout
export const DEFAULT_SMSIR_TEMPLATE_ID = 215446;
export const DEFAULT_SMSIR_PARAMETER_NAME = "Code";
export const DEFAULT_SMSIR_API_URL = "https://api.sms.ir/v1/send/verify";

interface MemoryOtpRecord {
  id: string;
  phone: string;
  code: string;
  expires_at: Date;
  used: boolean;
  attempts: number;
  created_at: Date;
}

const globalForOtp = globalThis as unknown as {
  __sazehemanOtpMemoryStore?: MemoryOtpRecord[];
  __sazehemanInFlightPhones?: Set<string>;
};

function getMemoryStore(): MemoryOtpRecord[] {
  if (!globalForOtp.__sazehemanOtpMemoryStore) {
    globalForOtp.__sazehemanOtpMemoryStore = [];
  }
  return globalForOtp.__sazehemanOtpMemoryStore;
}

function getInFlightSet(): Set<string> {
  if (!globalForOtp.__sazehemanInFlightPhones) {
    globalForOtp.__sazehemanInFlightPhones = new Set<string>();
  }
  return globalForOtp.__sazehemanInFlightPhones;
}

export function generateTraceId(): string {
  return `otp-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

export function maskPhone(phone: string | number | null | undefined): string {
  const str = String(phone || "").trim();
  if (str.length < 7) return "***";
  return `${str.slice(0, 4)}***${str.slice(-4)}`;
}

export function normalizeDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return "";
  let str = String(input).trim();
  for (let i = 0; i < 10; i++) {
    str = str.replaceAll(PERSIAN_DIGITS[i], String(i)).replaceAll(ARABIC_DIGITS[i], String(i));
  }
  return str;
}

export function normalizeIranPhone(rawPhone: string | number | null | undefined): string {
  const cleaned = normalizeDigits(rawPhone).replace(/[\s\-().]/g, "");
  if (!cleaned) return "";

  if (cleaned.startsWith("+98")) {
    return "0" + cleaned.slice(3);
  }
  if (cleaned.startsWith("0098")) {
    return "0" + cleaned.slice(4);
  }
  if (cleaned.startsWith("98") && cleaned.length === 12) {
    return "0" + cleaned.slice(2);
  }
  if (cleaned.startsWith("9") && cleaned.length === 10) {
    return "0" + cleaned;
  }
  return cleaned;
}

export function isValidIranPhone(rawPhone: string | number | null | undefined): boolean {
  const normalized = normalizeIranPhone(rawPhone);
  return /^09\d{9}$/.test(normalized);
}

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export interface SmsIrSendResult {
  ok: boolean;
  statusCode: number;
  message: string;
  errorCode?: string;
  smsIrStatus?: number | null;
  smsIrMessage?: string | null;
  messageId?: number;
  durationMs: number;
}

function classifySmsIrStatus(status: number | undefined | null, httpStatus: number): {
  errorCode: string;
  reason: string;
  userMessage: string;
} {
  if (httpStatus === 401 || status === 10 || status === 11 || status === 12 || status === 13 || status === 14) {
    return {
      errorCode: "SMSIR_AUTH_ERROR",
      reason: `Authentication/API key rejected by SMS.ir (httpStatus=${httpStatus}, smsIrStatus=${status ?? "N/A"})`,
      userMessage: "خطا در احراز هویت سرویس پیامک (کلید API نامعتبر، غیرفعال یا آی‌پی سرور غیرمجاز است).",
    };
  }
  if (status === 20 || httpStatus === 402) {
    return {
      errorCode: "SMSIR_INSUFFICIENT_CREDIT",
      reason: `Insufficient SMS.ir account credit (smsIrStatus=${status})`,
      userMessage: "اعتبار پنل پیامک برای ارسال کد کافی نیست.",
    };
  }
  if (httpStatus === 429 || status === 16 || status === 17) {
    return {
      errorCode: "SMSIR_RATE_LIMITED",
      reason: `Rate limit hit on SMS.ir gateway (httpStatus=${httpStatus}, smsIrStatus=${status ?? "N/A"})`,
      userMessage: "محدودیت ارسال در درگاه پیامک. لطفاً کمی بعد دوباره تلاش کنید.",
    };
  }
  if (httpStatus === 400 || status === 0 || status === 15 || status === 18 || status === 19) {
    return {
      errorCode: "SMSIR_INVALID_TEMPLATE_OR_PARAMS",
      reason: `Invalid templateId, parameter name, or mobile rejected by SMS.ir (httpStatus=${httpStatus}, smsIrStatus=${status ?? "N/A"})`,
      userMessage: "تنظیمات قالب یا پارامترهای ارسال پیامک در پنل SMS.ir معتبر نیست.",
    };
  }
  return {
    errorCode: "SMSIR_GATEWAY_ERROR",
    reason: `SMS.ir gateway returned non-success status (httpStatus=${httpStatus}, smsIrStatus=${status ?? "N/A"})`,
    userMessage: "ارسال پیامک از طریق درگاه SMS.ir با خطا مواجه شد.",
  };
}

export async function sendVerifySmsViaSmsIr(
  mobile: string,
  code: string,
  traceId: string
): Promise<SmsIrSendResult> {
  dotenv.config({ quiet: true } as any);

  const rawApiKey = (process.env.SMSIR_API_KEY || "").trim();
  const isPlaceholderKey =
    !rawApiKey ||
    rawApiKey === "YOUR_SMSIR_API_KEY" ||
    rawApiKey === "کلید_واقعی_SMSIR_شما" ||
    rawApiKey === "کلید_API_دریافتی_از_پنل_SMS_IR";

  const envTemplateId = (process.env.SMSIR_TEMPLATE_ID || "").trim();
  const hasValidEnvTemplate =
    envTemplateId !== "" &&
    envTemplateId !== "YOUR_SMSIR_TEMPLATE_ID" &&
    !Number.isNaN(Number(envTemplateId)) &&
    Number(envTemplateId) > 0;

  const templateId = hasValidEnvTemplate ? Number(envTemplateId) : DEFAULT_SMSIR_TEMPLATE_ID;
  const parameterName = (process.env.SMSIR_PARAMETER_NAME || DEFAULT_SMSIR_PARAMETER_NAME).trim() || DEFAULT_SMSIR_PARAMETER_NAME;
  const endpoint = (process.env.SMSIR_API_URL || DEFAULT_SMSIR_API_URL).trim() || DEFAULT_SMSIR_API_URL;
  const masked = maskPhone(mobile);

  console.log(
    `[OTP][${traceId}][STEP 3 - ENV CHECK]`,
    JSON.stringify({
      SMSIR_API_KEY_CONFIGURED: !isPlaceholderKey,
      SMSIR_API_KEY_LENGTH: rawApiKey.length,
      SMSIR_API_KEY_IS_PLACEHOLDER: isPlaceholderKey && rawApiKey.length > 0,
      SMSIR_TEMPLATE_ID: templateId,
      SMSIR_TEMPLATE_ID_SOURCE: hasValidEnvTemplate ? ".env" : "default(215446)",
      SMSIR_PARAMETER_NAME: parameterName,
      SMSIR_API_URL: endpoint,
      DATABASE_URL_CONFIGURED: Boolean((process.env.DATABASE_URL || "").trim()),
      NODE_ENV: process.env.NODE_ENV || "development",
    })
  );

  if (isPlaceholderKey) {
    console.error(
      `[OTP][${traceId}][CONFIG ERROR] SMSIR_API_KEY is missing or still set to a placeholder in .env / environment variables.`
    );
    return {
      ok: false,
      statusCode: 500,
      errorCode: "SMSIR_API_KEY_MISSING",
      message: "سرویس پیامک پیکربندی نشده است (کلید SMSIR_API_KEY در فایل .env تنظیم نشده است).",
      durationMs: 0,
    };
  }

  if (!Number.isInteger(templateId) || templateId <= 0) {
    console.error(
      `[OTP][${traceId}][CONFIG ERROR] SMSIR_TEMPLATE_ID is invalid: ${templateId}`
    );
    return {
      ok: false,
      statusCode: 500,
      errorCode: "SMSIR_TEMPLATE_ID_INVALID",
      message: "شناسه قالب پیامک (SMSIR_TEMPLATE_ID) به درستی در سرور تنظیم نشده است.",
      durationMs: 0,
    };
  }

  const requestPayload = {
    mobile,
    templateId,
    parameters: [
      {
        name: parameterName,
        value: code,
      },
    ],
  };

  console.log(
    `[OTP][${traceId}][STEP 6 - SMS.IR REQUEST START]`,
    JSON.stringify({
      method: "POST",
      url: endpoint,
      timeoutMs: SMSIR_REQUEST_TIMEOUT_MS,
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/plain, application/json",
        "x-api-key": "[REDACTED]",
      },
      body: {
        mobile: masked,
        templateId,
        parameters: [{ name: parameterName, value: "[REDACTED_OTP]" }],
      },
    })
  );

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), SMSIR_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/plain, application/json",
        "x-api-key": rawApiKey,
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutHandle);
    const durationMs = Date.now() - startTime;

    const rawText = await response.text();
    let payload: any = null;
    try {
      payload = rawText ? JSON.parse(rawText) : null;
    } catch {
      payload = null;
    }

    const smsIrStatus = payload && typeof payload.status !== "undefined" ? Number(payload.status) : null;
    const smsIrMessage = payload && typeof payload.message === "string" ? payload.message : null;

    console.log(
      `[OTP][${traceId}][STEP 7 - SMS.IR RESPONSE]`,
      JSON.stringify({
        httpStatus: response.status,
        httpOk: response.ok,
        durationMs,
        smsIrStatus,
        smsIrMessage,
        messageId: payload?.data?.messageId ?? null,
        cost: payload?.data?.cost ?? null,
        rawPreview: payload ? undefined : rawText.slice(0, 200),
      })
    );

    if (response.ok && smsIrStatus === 1) {
      return {
        ok: true,
        statusCode: 200,
        message: "کد تایید به شماره موبایل شما ارسال شد",
        smsIrStatus: 1,
        smsIrMessage,
        messageId: payload?.data?.messageId,
        durationMs,
      };
    }

    const classified = classifySmsIrStatus(smsIrStatus, response.status);
    console.error(
      `[OTP][${traceId}][SMS.IR REJECTED]`,
      JSON.stringify({
        errorCode: classified.errorCode,
        reason: classified.reason,
        httpStatus: response.status,
        smsIrStatus,
        smsIrMessage,
        durationMs,
      })
    );

    return {
      ok: false,
      statusCode: response.status >= 400 && response.status < 600 ? response.status : 502,
      errorCode: classified.errorCode,
      smsIrStatus,
      smsIrMessage,
      message: smsIrMessage
        ? `${classified.userMessage} (${smsIrMessage})`
        : classified.userMessage,
      durationMs,
    };
  } catch (err: any) {
    clearTimeout(timeoutHandle);
    const durationMs = Date.now() - startTime;
    const isTimeout = err?.name === "AbortError";

    console.error(
      `[OTP][${traceId}][STEP 7 - SMS.IR NETWORK/TIMEOUT ERROR]`,
      JSON.stringify({
        errorCode: isTimeout ? "SMSIR_TIMEOUT" : "SMSIR_NETWORK_ERROR",
        errorName: err?.name || "Error",
        errorMessage: err?.message || String(err),
        cause: err?.cause ? String(err.cause) : undefined,
        durationMs,
      })
    );

    if (isTimeout) {
      return {
        ok: false,
        statusCode: 504,
        errorCode: "SMSIR_TIMEOUT",
        message: "پاسخ از درگاه پیامک SMS.ir در زمان مقرر دریافت نشد (Timeout). لطفاً دوباره تلاش کنید.",
        durationMs,
      };
    }

    return {
      ok: false,
      statusCode: 502,
      errorCode: "SMSIR_NETWORK_ERROR",
      message: "خطا در برقراری ارتباط شبکه با درگاه پیامک SMS.ir. لطفاً اتصال سرور را بررسی کنید.",
      durationMs,
    };
  }
}

export interface OtpRequestResult {
  ok: boolean;
  status: number;
  message: string;
  ttl?: number;
  phone?: string;
  traceId: string;
  errorCode?: string;
  durationMs?: number;
}

export async function requestOtpCode(
  rawPhone: string | number,
  sourceEndpoint: string = "unknown"
): Promise<OtpRequestResult> {
  const traceId = generateTraceId();
  const totalStart = Date.now();
  const maskedInput = maskPhone(normalizeIranPhone(rawPhone) || String(rawPhone || ""));

  console.log(
    `[OTP][${traceId}][STEP 1 - REQUEST RECEIVED]`,
    JSON.stringify({
      sourceEndpoint,
      timestamp: new Date().toISOString(),
      rawInputType: typeof rawPhone,
      rawInputLength: String(rawPhone ?? "").length,
      maskedInput,
    })
  );

  const phone = normalizeIranPhone(rawPhone);
  const valid = isValidIranPhone(phone);
  const masked = maskPhone(phone);

  console.log(
    `[OTP][${traceId}][STEP 2 - PHONE VALIDATION]`,
    JSON.stringify({
      maskedPhone: masked,
      normalizedLength: phone.length,
      isValid: valid,
    })
  );

  if (!valid) {
    console.warn(`[OTP][${traceId}][STEP 8 - FINAL RESULT] FAILED (INVALID_PHONE)`);
    return {
      ok: false,
      status: 400,
      errorCode: "INVALID_PHONE",
      message: "شماره موبایل معتبر نیست. شماره باید با 09 شروع شود و ۱۱ رقم باشد.",
      traceId,
      durationMs: Date.now() - totalStart,
    };
  }

  // Prevent concurrent duplicate requests for the same phone number
  const inFlight = getInFlightSet();
  if (inFlight.has(phone)) {
    console.warn(`[OTP][${traceId}][DUPLICATE_IN_FLIGHT] Request already in progress for ${masked}`);
    return {
      ok: false,
      status: 429,
      errorCode: "REQUEST_IN_FLIGHT",
      message: "درخواست ارسال پیامک در حال انجام است. لطفاً چند لحظه صبر کنید.",
      phone,
      traceId,
      durationMs: Date.now() - totalStart,
    };
  }

  inFlight.add(phone);

  try {
    const now = Date.now();
    const cooldownBoundary = new Date(now - OTP_RESEND_COOLDOWN_SECONDS * 1000);
    const windowBoundary = new Date(now - OTP_RATE_LIMIT_WINDOW_MS);

    let recentCode: { id: string; created_at: Date } | null = null;
    let recentCount = 0;
    let usingMemoryFallback = false;

    try {
      recentCode = await prisma.smsCode.findFirst({
        where: {
          phone,
          used: false,
          created_at: { gte: cooldownBoundary },
        },
        orderBy: { created_at: "desc" },
        select: { id: true, created_at: true },
      });

      recentCount = await prisma.smsCode.count({
        where: {
          phone,
          created_at: { gte: windowBoundary },
        },
      });
    } catch (dbErr: any) {
      usingMemoryFallback = true;
      console.warn(
        `[OTP][${traceId}][STEP 4 - DB WARNING] Prisma query failed (${dbErr?.name || "Error"}: ${
          dbErr?.message?.split("\n")[0] || "DB unreachable"
        }). Using in-memory OTP store fallback.`
      );
      const mem = getMemoryStore();
      const activeRecent = mem
        .filter((r) => r.phone === phone && !r.used && r.created_at >= cooldownBoundary)
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0];
      recentCode = activeRecent ? { id: activeRecent.id, created_at: activeRecent.created_at } : null;
      recentCount = mem.filter((r) => r.phone === phone && r.created_at >= windowBoundary).length;
    }

    if (recentCode) {
      const elapsedSeconds = Math.floor((now - recentCode.created_at.getTime()) / 1000);
      const remaining = Math.max(1, OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds);
      console.warn(
        `[OTP][${traceId}][STEP 4 - COOLDOWN ACTIVE] Phone=${masked}, remainingSeconds=${remaining}`
      );
      return {
        ok: false,
        status: 429,
        errorCode: "OTP_COOLDOWN",
        message: `کد قبلی هنوز معتبر است. لطفاً ${remaining} ثانیه دیگر صبر کنید.`,
        ttl: remaining,
        phone,
        traceId,
        durationMs: Date.now() - totalStart,
      };
    }

    if (recentCount >= OTP_RATE_LIMIT_MAX_REQUESTS) {
      console.warn(
        `[OTP][${traceId}][STEP 4 - RATE LIMIT EXCEEDED] Phone=${masked}, countIn15m=${recentCount}`
      );
      return {
        ok: false,
        status: 429,
        errorCode: "OTP_RATE_LIMIT",
        message: "تعداد درخواست‌های ارسال پیامک بیش از حد مجاز است. لطفاً چند دقیقه دیگر تلاش کنید.",
        phone,
        traceId,
        durationMs: Date.now() - totalStart,
      };
    }

    const code = generateOtpCode();
    const expiresAt = new Date(now + OTP_TTL_SECONDS * 1000);
    let createdId = crypto.randomUUID();

    if (!usingMemoryFallback) {
      try {
        const created = await prisma.smsCode.create({
          data: {
            phone,
            code,
            expires_at: expiresAt,
            used: false,
            attempts: 0,
          },
        });
        createdId = created.id;
      } catch (dbCreateErr: any) {
        usingMemoryFallback = true;
        console.warn(
          `[OTP][${traceId}][STEP 5 - DB CREATE FALLBACK] Prisma create failed (${
            dbCreateErr?.message?.split("\n")[0] || "DB error"
          }). Saving OTP in memory store.`
        );
      }
    }

    if (usingMemoryFallback) {
      getMemoryStore().push({
        id: createdId,
        phone,
        code,
        expires_at: expiresAt,
        used: false,
        attempts: 0,
        created_at: new Date(now),
      });
    }

    console.log(
      `[OTP][${traceId}][STEP 5 - OTP GENERATED & STORED]`,
      JSON.stringify({
        recordId: createdId,
        maskedPhone: masked,
        storageBackend: usingMemoryFallback ? "memory-fallback" : "postgresql-prisma",
        expiresAt: expiresAt.toISOString(),
        ttlSeconds: OTP_TTL_SECONDS,
      })
    );

    const smsResult = await sendVerifySmsViaSmsIr(phone, code, traceId);

    if (!smsResult.ok) {
      if (!usingMemoryFallback) {
        await prisma.smsCode.delete({ where: { id: createdId } }).catch(() => {});
      } else {
        const mem = getMemoryStore();
        const idx = mem.findIndex((r) => r.id === createdId);
        if (idx !== -1) mem.splice(idx, 1);
      }

      const totalDurationMs = Date.now() - totalStart;
      console.error(
        `[OTP][${traceId}][STEP 8 - FINAL RESULT]`,
        JSON.stringify({
          outcome: "FAILED",
          errorCode: smsResult.errorCode || "SMS_SEND_FAILED",
          httpStatus: smsResult.statusCode || 502,
          otpRecordRolledBack: true,
          totalDurationMs,
        })
      );

      return {
        ok: false,
        status: smsResult.statusCode || 502,
        errorCode: smsResult.errorCode || "SMS_SEND_FAILED",
        message: smsResult.message,
        phone,
        traceId,
        durationMs: totalDurationMs,
      };
    }

    const totalDurationMs = Date.now() - totalStart;
    console.log(
      `[OTP][${traceId}][STEP 8 - FINAL RESULT]`,
      JSON.stringify({
        outcome: "SUCCESS",
        httpStatus: 200,
        maskedPhone: masked,
        messageId: smsResult.messageId ?? null,
        ttlSeconds: OTP_TTL_SECONDS,
        totalDurationMs,
      })
    );

    return {
      ok: true,
      status: 200,
      message: "کد تایید به شماره موبایل شما ارسال شد",
      ttl: OTP_TTL_SECONDS,
      phone,
      traceId,
      durationMs: totalDurationMs,
    };
  } finally {
    inFlight.delete(phone);
  }
}

export interface OtpVerifyResult {
  ok: boolean;
  status: number;
  message: string;
  phone?: string;
  traceId: string;
  errorCode?: string;
}

export async function verifyOtpCode(
  rawPhone: string | number,
  rawCode: string | number,
  sourceEndpoint: string = "unknown"
): Promise<OtpVerifyResult> {
  const traceId = generateTraceId();
  const phone = normalizeIranPhone(rawPhone);
  const code = normalizeDigits(rawCode).replace(/\s+/g, "");
  const masked = maskPhone(phone);

  console.log(
    `[OTP-VERIFY][${traceId}][START]`,
    JSON.stringify({
      sourceEndpoint,
      maskedPhone: masked,
      codeLength: code.length,
    })
  );

  if (!isValidIranPhone(phone)) {
    return {
      ok: false,
      status: 400,
      errorCode: "INVALID_PHONE",
      message: "شماره موبایل معتبر نیست",
      traceId,
    };
  }

  if (!/^\d{6}$/.test(code)) {
    return {
      ok: false,
      status: 400,
      errorCode: "INVALID_CODE_FORMAT",
      message: "کد تایید باید ۶ رقم باشد",
      traceId,
    };
  }

  let latestCode: MemoryOtpRecord | null = null;
  let usingMemoryFallback = false;

  try {
    latestCode = await prisma.smsCode.findFirst({
      where: {
        phone,
        used: false,
      },
      orderBy: { created_at: "desc" },
    });
  } catch (dbErr: any) {
    usingMemoryFallback = true;
    console.warn(
      `[OTP-VERIFY][${traceId}][DB WARNING] Prisma query failed (${
        dbErr?.message?.split("\n")[0] || "DB error"
      }). Checking in-memory OTP store.`
    );
  }

  if (!latestCode) {
    const mem = getMemoryStore();
    const memMatch = mem
      .filter((r) => r.phone === phone && !r.used)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0];
    if (memMatch) {
      latestCode = memMatch;
      usingMemoryFallback = true;
    }
  }

  if (!latestCode) {
    console.warn(`[OTP-VERIFY][${traceId}][FAILED] No active OTP found for ${masked}`);
    return {
      ok: false,
      status: 400,
      errorCode: "OTP_NOT_FOUND",
      message: "کد معتبر نیست یا قبلاً استفاده شده است. لطفاً کد جدید دریافت کنید.",
      traceId,
    };
  }

  const now = new Date();
  if (latestCode.expires_at <= now) {
    if (!usingMemoryFallback) {
      await prisma.smsCode.update({
        where: { id: latestCode.id },
        data: { used: true },
      }).catch(() => {});
    } else {
      latestCode.used = true;
    }
    console.warn(`[OTP-VERIFY][${traceId}][FAILED] OTP expired for ${masked}`);
    return {
      ok: false,
      status: 400,
      errorCode: "OTP_EXPIRED",
      message: "کد تایید منقضی شده است. لطفاً کد جدید دریافت کنید.",
      traceId,
    };
  }

  if (latestCode.attempts >= OTP_MAX_ATTEMPTS) {
    if (!usingMemoryFallback) {
      await prisma.smsCode.update({
        where: { id: latestCode.id },
        data: { used: true },
      }).catch(() => {});
    } else {
      latestCode.used = true;
    }
    console.warn(`[OTP-VERIFY][${traceId}][FAILED] Max attempts already reached for ${masked}`);
    return {
      ok: false,
      status: 429,
      errorCode: "OTP_MAX_ATTEMPTS",
      message: "تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً کد جدید دریافت کنید.",
      traceId,
    };
  }

  if (latestCode.code !== code) {
    const nextAttempts = latestCode.attempts + 1;
    const exhausted = nextAttempts >= OTP_MAX_ATTEMPTS;

    if (!usingMemoryFallback) {
      await prisma.smsCode.update({
        where: { id: latestCode.id },
        data: {
          attempts: { increment: 1 },
          ...(exhausted ? { used: true } : {}),
        },
      }).catch(() => {});
    } else {
      latestCode.attempts = nextAttempts;
      if (exhausted) latestCode.used = true;
    }

    console.warn(
      `[OTP-VERIFY][${traceId}][MISMATCH] Phone=${masked}, attempt=${nextAttempts}/${OTP_MAX_ATTEMPTS}, invalidated=${exhausted}`
    );

    if (exhausted) {
      return {
        ok: false,
        status: 429,
        errorCode: "OTP_MAX_ATTEMPTS",
        message: "تعداد تلاش‌های ناموفق بیش از حد مجاز است. کد تایید باطل شد.",
        traceId,
      };
    }

    return {
      ok: false,
      status: 400,
      errorCode: "OTP_MISMATCH",
      message: "کد وارد شده اشتباه است",
      traceId,
    };
  }

  if (!usingMemoryFallback) {
    await prisma.smsCode.updateMany({
      where: { phone, used: false },
      data: { used: true },
    }).catch(() => {});
  } else {
    for (const item of getMemoryStore()) {
      if (item.phone === phone) item.used = true;
    }
  }

  console.log(`[OTP-VERIFY][${traceId}][SUCCESS] Phone=${masked} verified.`);

  return {
    ok: true,
    status: 200,
    message: "شماره موبایل تایید شد",
    phone,
    traceId,
  };
}

export function hasRecentVerifiedMemoryOtp(phone: string, withinMs: number = 30 * 60 * 1000): boolean {
  const cutoff = Date.now() - withinMs;
  return getMemoryStore().some(
    (r) => r.phone === phone && r.used && r.created_at.getTime() >= cutoff
  );
}
