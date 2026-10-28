'use client';
import CustomButton from "@/components/ui/base/CustomButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { optimizeForm } from "@/lib/utils/global";
import { setApiInfo } from "@/lib/hooks/useApiInfo";
import PhoneInput from "@/components/ui/base/PhoneInput";
import { useRef, useState } from "react";
import { IconCharity, IconStore } from "@/components/ui/SVGs";

type Mode = "sazeheman" | "shoghlman";

function normalizeClientPhone(raw: unknown): string {
    if (raw === null || raw === undefined) return "";
    const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    let str = String(raw).trim();
    for (let i = 0; i < 10; i++) {
        str = str.replaceAll(persian[i], String(i)).replaceAll(arabic[i], String(i));
    }
    str = str.replace(/[\s\-().]/g, "");
    if (str.startsWith("+98")) str = "0" + str.slice(3);
    else if (str.startsWith("0098")) str = "0" + str.slice(4);
    else if (str.startsWith("98") && str.length === 12) str = "0" + str.slice(2);
    else if (str.startsWith("9") && str.length === 10) str = "0" + str;
    return str;
}

function maskClientPhone(phone: string): string {
    if (!phone || phone.length < 7) return "***";
    return `${phone.slice(0, 4)}***${phone.slice(-4)}`;
}

function Page() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("sazeheman");
    const [loading, setLoading] = useState(false);
    const inFlightRef = useRef(false);

    const handleSubmit = async (e: React.FormEvent) => {
        const json = optimizeForm(e).toJson();
        const normalizedPhone = normalizeClientPhone(json.phone);
        const maskedPhone = maskClientPhone(normalizedPhone);

        console.info("[SMS-CLIENT][CLICK] User clicked send OTP button", {
            mode,
            maskedPhone,
            timestamp: new Date().toISOString(),
        });

        if (inFlightRef.current || loading) {
            console.warn("[SMS-CLIENT][SKIP] Duplicate click ignored while request is in flight");
            return;
        }

        if (!normalizedPhone) {
            console.warn("[SMS-CLIENT][VALIDATION_ERROR] Empty phone input");
            window.alert("شماره تلفن خود را وارد کنید");
            return;
        }
        if (!/^09\d{9}$/.test(normalizedPhone)) {
            console.warn("[SMS-CLIENT][VALIDATION_ERROR] Invalid phone format", {
                maskedPhone,
                length: normalizedPhone.length,
            });
            window.alert("شماره تلفن اشتباه است");
            setApiInfo({
                errors: { phone: ['شماره تلفن اشتباه است!'] },
                message: "",
                code: 400
            });
            return;
        }

        const endpoint = mode === "shoghlman" ? "/api/business/sms-send" : "/api/auth/sms-send";
        const method = "POST";
        const startTime = performance.now();

        inFlightRef.current = true;
        setLoading(true);

        console.info("[SMS-CLIENT][REQUEST] Sending OTP request to backend", {
            endpoint,
            method,
            maskedPhone,
        });

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ phone: normalizedPhone }),
            });

            const durationMs = Math.round(performance.now() - startTime);
            const data = await response.json().catch(() => ({}));

            console.info("[SMS-CLIENT][RESPONSE] Received response from backend", {
                endpoint,
                method,
                httpStatus: response.status,
                ok: response.ok && Boolean(data?.status),
                durationMs,
                traceId: data?.traceId || null,
                errorCode: data?.errorCode || null,
                message: data?.message || null,
            });

            if (!response.ok || !data?.status) {
                if (response.status === 429 && data?.ttl) {
                    console.warn("[SMS-CLIENT][COOLDOWN] Active OTP already exists, navigating to code input", {
                        ttl: data.ttl,
                        traceId: data.traceId,
                    });
                } else {
                    window.alert(data?.message || "خطا در ارسال پیامک تایید");
                    setLoading(false);
                    inFlightRef.current = false;
                    return;
                }
            }

            if (mode === "shoghlman") {
                router.push("/auth/business/verify?phone=" + encodeURIComponent(normalizedPhone));
            } else {
                router.push("./auth/code?phone=" + encodeURIComponent(normalizedPhone));
            }
        } catch (err: any) {
            const durationMs = Math.round(performance.now() - startTime);
            console.error("[SMS-CLIENT][ERROR] Failed to communicate with backend OTP endpoint", {
                endpoint,
                method,
                durationMs,
                errorName: err?.name || "Error",
                errorMessage: err?.message || "Unknown network error",
            });
            window.alert("خطا در برقراری ارتباط با سرور جهت ارسال پیامک");
            setLoading(false);
            inFlightRef.current = false;
        }
    };

    return (
        <div className="w-full max-w-lg" dir="rtl">
            <div className="text-right mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#173D35] mb-3 leading-tight">
                    ورود و ثبت‌نام
                </h1>
                <p className="text-base text-[#6B7771]">
                    نوع حساب خود را انتخاب کنید و شماره تلفن خود را وارد کنید
                </p>
            </div>

            {/* Account type selector */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                    type="button"
                    onClick={() => setMode("sazeheman")}
                    className={`relative rounded-2xl border-2 p-5 flex flex-col items-center gap-3 transition-all text-center min-h-44 ${
                        mode === "sazeheman"
                            ? "border-[#36B98A] bg-[#E7F5EE] ring-2 ring-[#36B98A]/20"
                            : "border-[#E7F5EE] bg-white hover:border-[#36B98A]/40"
                    }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        mode === "sazeheman" ? "bg-[#36B98A]/15" : "bg-[#F7F8F6]"
                    }`}>
                        <IconCharity width={32} height={32} />
                    </div>
                    <span className={`font-bold text-base ${mode === "sazeheman" ? "text-[#173D35]" : "text-[#252C2A]"}`}>
                        سازه من
                    </span>
                    <span className="text-xs text-[#6B7771] leading-relaxed">
                        ثبت پروژه و ارتباط با متخصصان ساختمانی
                    </span>
                    {mode === "sazeheman" && (
                        <span className="absolute top-3 left-3 flex items-center justify-center w-5 h-5 rounded-full bg-[#36B98A] text-white">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => setMode("shoghlman")}
                    className={`relative rounded-2xl border-2 p-5 flex flex-col items-center gap-3 transition-all text-center min-h-44 ${
                        mode === "shoghlman"
                            ? "border-[#36B98A] bg-[#E7F5EE] ring-2 ring-[#36B98A]/20"
                            : "border-[#E7F5EE] bg-white hover:border-[#36B98A]/40"
                    }`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        mode === "shoghlman" ? "bg-[#36B98A]/15" : "bg-[#F7F8F6]"
                    }`}>
                        <IconStore width={32} height={32} />
                    </div>
                    <span className={`font-bold text-base ${mode === "shoghlman" ? "text-[#173D35]" : "text-[#252C2A]"}`}>
                        شغل من
                    </span>
                    <span className="text-xs text-[#6B7771] leading-relaxed">
                        ثبت کسب‌وکار و دریافت درخواست‌های مرتبط
                    </span>
                    {mode === "shoghlman" && (
                        <span className="absolute top-3 left-3 flex items-center justify-center w-5 h-5 rounded-full bg-[#36B98A] text-white">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </span>
                    )}
                </button>
            </div>

            {/* Phone form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#252C2A] text-right">
                        شماره تلفن
                    </label>
                    <PhoneInput required />
                </div>

                <CustomButton
                    loading={loading}
                    shadow
                    className="w-full min-h-13! text-base! whitespace-nowrap!"
                    type="submit"
                >
                    {mode === "shoghlman" ? "شروع ثبت شغل" : "ورود / ثبت‌نام"}
                </CustomButton>
            </form>

            <div className="mt-8 pt-6 border-t border-[#E7F5EE]">
                <p className="text-sm text-[#6B7771] text-right leading-relaxed">
                    ورود شما به منزله پذیرفتن{" "}
                    <Link href="/terms" className="inline">
                        <span className="text-[#36B98A] cursor-pointer font-medium">قوانین و مقررات</span>
                    </Link>{" "}
                    سازه من می‌باشد
                </p>
            </div>
        </div>
    );
}

export default Page;
