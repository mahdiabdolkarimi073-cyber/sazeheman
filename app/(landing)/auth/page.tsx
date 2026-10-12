'use client';

import CustomButton from "@/components/ui/base/CustomButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { optimizeForm } from "@/lib/utils/global";
import { setApiInfo } from "@/lib/hooks/useApiInfo";
import PhoneInput from "@/components/ui/base/PhoneInput";
import { useState } from "react";
import { IconCharity, IconStore } from "@/components/ui/SVGs";

type Mode = "sazeheman" | "shoghlman";

function Page() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("sazeheman");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        const json = optimizeForm(e).toJson();
        if (!json.phone) {
            window.alert("شماره تلفن خود را وارد کنید");
            return;
        }
        if (json.phone.length < 10) {
            window.alert("شماره تلفن اشتباه است");
            setApiInfo({
                errors: { phone: ['شماره تلفن اشتباه است!'] },
                message: "",
                code: 400
            });
            return;
        }

        setLoading(true);
        if (mode === "shoghlman") {
            router.push("/auth/business/verify?phone=" + json.phone);
        } else {
            router.push("./auth/code?phone=" + json.phone);
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
