'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {IconEdit} from "@/components/ui/SVGs";
import Link from "next/link";
import {Button, PinInput} from "@mantine/core";
import CustomButton from "@/components/ui/base/CustomButton";
import {sleep} from "@/lib/utils/global";
import {useRouter, useSearchParams} from "next/navigation";
import {useDelayedEffect} from "@/lib/hooks/useEffect";
import {authUser} from "@/app/(landing)/auth/action";

function AuthCodeValidator(
    {
        tiny = false,
        edit = undefined as (() => void) | undefined,
        sendRoute = '',
        verifyRoute = '',
        onVerify = undefined as (() => void) | undefined,
        ...props
    }
) {
    const router = useRouter();
    const params = useSearchParams();
    const phone = useMemo(() => {
        return props.phone || params.get('phone') || "";
    }, [params])
    const [code, setCode] = useState("");
    const [sec, setSec] = useState(0);
    const [checking, setChecking] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (sec <= 0) return;
        sleep(1000).then(() => {
            setSec(prev => Math.max(0, prev - 1));
        })
    }, [sec]);

    useDelayedEffect(() => {
        if ((tiny && !verifyRoute) || code.length !== 6) return;
        setChecking(true);
        authUser(+phone, "sazeheman")
            .then(async () => {
                router.push("/dashboard");
                alert(`خوش آمدید`);
            })
            .catch(()=>{
                alert("خطا در بررسی اطلاعات")
            })
    }, [code]);

    return (
        <div className="w-full max-w-lg" dir="rtl">
            <div className="text-right mb-8">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-[#E7F5EE] text-[#36B98A] text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36B98A]" />
                    سازه من
                </div>
                {!tiny && (
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#173D35] mb-3 leading-tight">
                        کد ارسال شده را وارد کنید
                    </h1>
                )}
                <div className="text-sm text-[#6B7771] flex gap-1 items-center justify-start flex-wrap">
                    کد برای شماره تماس
                    <Link href={'./'} onClick={e => {
                        if (!edit) return;
                        e.preventDefault();
                        e.stopPropagation();
                        edit();
                    }}>
                        <div className="bg-[#E7F5EE] flex rounded-xl p-1 px-2 gap-1 items-center text-[#36B98A]">
                            <IconEdit/>
                            <span className="mt-0.5">
                                {(+phone || 0).toLocaleString('fa').replaceAll("٬", "")}
                            </span>
                        </div>
                    </Link>
                    ارسال شده است.
                </div>
            </div>

            <div className="flex items-stretch mb-8">
                <PinInput
                    disabled={checking}
                    length={6}
                    value={code}
                    placeholder=""
                    type={'number'}
                    autoFocus
                    name="code"
                    classNames={{pinInput: "w-full!"}}
                    onChange={setCode}
                    size={'md'}
                    radius={'md'}
                    className="w-full justify-stretch!"
                />
            </div>

            <div className="flex flex-col gap-5">
                {!sec ? (
                    <CustomButton loading={sending} onClick={() => setSending(false)} className="small p-1! w-28 mx-auto">
                        ارسال مجدد
                    </CustomButton>
                ) : (
                    <p className="text-center text-[#6B7771] text-sm">
                        دریافت مجدد {sec} ثانیه
                    </p>
                )}
                {!tiny && (
                    <Button
                        radius="xl"
                        loading={checking}
                        disabled={code.length !== 6 || sec === 0}
                        size="lg"
                    >
                        ورود
                    </Button>
                )}
            </div>
        </div>
    );
}

export default AuthCodeValidator;
