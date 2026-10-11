'use client';

import CustomButton from "@/components/ui/base/CustomButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { optimizeForm } from "@/lib/utils/global";
import { setApiInfo } from "@/lib/hooks/useApiInfo";
import PhoneInput from "@/components/ui/base/PhoneInput";
import { useState } from "react";
import { IconStore, IconCharity } from "@/components/ui/SVGs";

type Mode = "sazeheman" | "shoghlman";

function Page() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("sazeheman");

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

        if (mode === "shoghlman") {
            router.push("/auth/business/verify?phone=" + json.phone);
        } else {
            router.push("./auth/code?phone=" + json.phone);
        }
    };

    return (
        <div className="flex flex-col gap-2 max-w-md w-full">
            <h3 className="text-3xl font-semibold">ورود و ثبت نام</h3>
            <p className="opacity-60">نوع حساب خود را انتخاب کنید</p>

            <div className="flex gap-2 mt-2">
                <button
                    type="button"
                    onClick={() => setMode("sazeheman")}
                    className={`flex-1 rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all ${
                        mode === "sazeheman"
                            ? "border-primary bg-primary/5"
                            : "border-white/10 hover:border-white/20"
                    }`}
                >
                    <IconCharity width={32} height={32} />
                    <span className="font-medium text-sm">سازه من</span>
                    <span className="text-xs opacity-50">ورود کاربران عادی</span>
                </button>
                <button
                    type="button"
                    onClick={() => setMode("shoghlman")}
                    className={`flex-1 rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all ${
                        mode === "shoghlman"
                            ? "border-primary bg-primary/5"
                            : "border-white/10 hover:border-white/20"
                    }`}
                >
                    <IconStore width={32} height={32} />
                    <span className="font-medium text-sm">شغل من</span>
                    <span className="text-xs opacity-50">ثبت کسب و کار و خدمات</span>
                </button>
            </div>

            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                {mode === "shoghlman" && (
                    <p className="text-sm text-primary mt-2">
                        شماره تلفن خود را وارد کنید تا کد تایید برایتان ارسال شود
                    </p>
                )}
                <PhoneInput my="lg" required />
                <CustomButton className="w-full big" type="submit">
                    {mode === "shoghlman" ? "شروع ثبت شغل" : "ورود"}
                </CustomButton>
            </form>

            <br/>
            <p className="opacity-60">
                ورود شما به منزله پذیرفتن
                <Link href={'/terms'} className="inline!">
                    {" "}
                    <span className="text-primary cursor-pointer">قوانین و مقررات</span>
                    {" "}
                </Link>
                سازه من میباشد
            </p>
        </div>
    );
}

export default Page;
