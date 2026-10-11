'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {IconEdit} from "@/components/ui/SVGs";
import Link from "next/link";
import {Button, PinInput} from "@mantine/core";
import CustomButton from "@/components/ui/base/CustomButton";
import {sleep} from "@/lib/utils/global";
import {api} from "@/lib/api/base";
import {useRouter, useSearchParams} from "next/navigation";
import {useDelayedEffect} from "@/lib/hooks/useEffect";
import {authUser, setUserToken} from "@/app/(landing)/auth/action";
import {UserType} from "@/lib/hooks/useUser";

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
    // useDelayedEffect(() => {
    //     if (sending) {
    //         if (!phone) {
    //             alert("شماره تلفن وارد نشده است")
    //             router.push("/auth");
    //             return;
    //         }
    //         api(sendRoute || "/auth/login", {
    //             phone,
    //             _silence: true
    //         }, "POST").then((e) => {
    //             setSec(e?.data?.ttl ?? e?.data?.code?.ttl ?? 180);
    //         }).catch((e) => {
    //             const ttl = e?.data?.ttl;
    //             if (!ttl) {
    //                 window.alert(e?.data?.message ?? e?.message);
    //                 edit?.();
    //             }
    //             setSec(ttl || sec);
    //         }).finally(() => {
    //             setSending(false);
    //         })
    //     }
    // }, [sending, phone]);
    useDelayedEffect(() => {
        if ((tiny && !verifyRoute) || code.length !== 6) return;
        setChecking(true);
        // api(verifyRoute || "/auth/login/verify", {
        //     phone,
        //     code
        // }, "POST")
        //     .then(async (e) => {
        //         if (onVerify) return onVerify();
        //         await setUserToken(e?.data?.token + "")
        //             .catch(() => {
        //                 alert("خطا در تنظیم کوکی ها، تنظیمات مرورگر خود را بررسی کنید");
        //             })
        //             .then(() => {
        //                 router.push("/dashboard");
        //                 alert(`خوش آمدید`);
        //             })
        //             .finally(() => {
        //                 setChecking(false);
        //             })
        //     })
        //     .catch(() => {
        //         setChecking(false);
        //         setCode("");
        //     })
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
        <div className={'flex flex-col gap-4 justify-center max-w-sm'}>
            {!tiny && (
                <h3 className={'text-2xl text-center lg:text-start font-semibold'}>کد ارسال شده را وارد کنید</h3>
            )}
            <div className={'opacity-60 flex gap-1 items-center justify-center lg:justify-start flex-wrap'}>
                کد برای شماره تماس
                <Link href={'./'} onClick={e => {
                    if (!edit) return;
                    e.preventDefault();
                    e.stopPropagation();
                    edit();
                }}>
                    <div className={'bg-primary/10 flex rounded-xl p-1 px-2 gap-1 items-center text-primary'}>
                        <IconEdit/>
                        <span className='mt-1'>
                            {(+phone || 0).toLocaleString('fa').replaceAll("٬", "")}
                        </span>
                    </div>
                </Link>
                ارسال شده است.
            </div>
            <div className={'flex items-stretch'}>
                <PinInput
                    disabled={checking}
                    length={6}
                    value={code}
                    placeholder=""
                    type={'number'}
                    autoFocus
                    name="code"
                    classNames={{
                        pinInput: "w-full!"
                    }}
                    onChange={setCode}
                    size={'md'}
                    radius={'md'}
                    className={"w-full justify-stretch!"}
                />
            </div>
            {!sec ? (
                <CustomButton loading={sending} onClick={() => setSending(false)} className={'small p-1! w-26 mx-auto'}>
                    ارسال مجدد
                </CustomButton>
            ) : (
                <p className={'text-center opacity-70 text-sm'}>
                    دریافت مجدد {sec} ثانیه
                </p>
            )}
            {!tiny && (
                <Button
                    radius={'xl'}
                    loading={checking}
                    disabled={code.length !== 6 || sec === 0}
                >
                    ورود
                </Button>
            )}
        </div>
    );
}

export default AuthCodeValidator;