'use client';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Link from "next/link";
import {IconEdit} from "@/components/ui/SVGs";
import {Button, PinInput} from "@mantine/core";
import CustomButton from "@/components/ui/base/CustomButton";
import {sleep} from "@/lib/utils/global";
import {useRouter, useSearchParams} from "next/navigation";
import {useDelayedEffect} from "@/lib/hooks/useEffect";
import {authUser} from "@/app/(landing)/auth/action";
import {api} from "@/lib/api/base";

function maskClientPhone(phone: string): string {
    const str = String(phone || "").trim();
    if (str.length < 7) return "***";
    return `${str.slice(0, 4)}***${str.slice(-4)}`;
}

function AuthCodeValidator(
    {
        tiny = false,
        edit = undefined as (() => void) | undefined,
        sendRoute = '',
        verifyRoute = '',
        onVerify = undefined as (() => void) | undefined,
        ...props
    }: any) {
    const router = useRouter();
    const params = useSearchParams();
    const phone = useMemo(() => {
        return props.phone || params.get('phone') || "";
    }, [props.phone, params]);
    const [code, setCode] = useState("");
    const [sec, setSec] = useState(120);
    const [checking, setChecking] = useState(false);
    const [sending, setSending] = useState(false);
    const sentMountRef = useRef(false);
    const resendLockRef = useRef(false);

    useEffect(() => {
        if (!sendRoute || !phone || sentMountRef.current) return;
        sentMountRef.current = true;
        const endpoint = sendRoute.startsWith("/api") ? sendRoute : `/api${sendRoute}`;
        const startTime = performance.now();
        setSending(true);

        console.info("[SMS-CLIENT][REQUEST] Auto-sending OTP on mount", {
            endpoint,
            method: "POST",
            maskedPhone: maskClientPhone(String(phone)),
        });

        api(sendRoute, { phone }, 'POST')
            .then((res: any) => {
                console.info("[SMS-CLIENT][RESPONSE] Auto-send OTP succeeded", {
                    endpoint,
                    method: "POST",
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: res?.data?.traceId || null,
                });
                setSec(res?.data?.ttl || 120);
            })
            .catch((err: any) => {
                console.error("[SMS-CLIENT][ERROR] Auto-send OTP failed", {
                    endpoint,
                    method: "POST",
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: err?.data?.traceId || null,
                    errorCode: err?.data?.errorCode || null,
                    message: err?.message || "خطا در ارسال پیامک",
                });
                setSec(0);
            })
            .finally(() => setSending(false));
    }, [sendRoute, phone]);

    useEffect(() => {
        if (sec <= 0) return;
        sleep(1000).then(() => {
            setSec(prev => Math.max(0, prev - 1));
        });
    }, [sec]);

    const handleResend = async () => {
        if (!phone || sending || resendLockRef.current) return;
        const maskedPhone = maskClientPhone(String(phone));
        const endpoint = sendRoute ? (sendRoute.startsWith("/api") ? sendRoute : `/api${sendRoute}`) : "/api/auth/sms-send";
        const method = "POST";
        const startTime = performance.now();

        console.info("[SMS-CLIENT][CLICK] User clicked resend OTP button", {
            endpoint,
            method,
            maskedPhone,
        });

        resendLockRef.current = true;
        setSending(true);

        try {
            if (sendRoute) {
                const res: any = await api(sendRoute, { phone }, 'POST');
                console.info("[SMS-CLIENT][RESPONSE] Resend OTP response", {
                    endpoint,
                    method,
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: res?.data?.traceId || null,
                });
                setSec(res?.data?.ttl || 120);
                setCode("");
            } else {
                console.info("[SMS-CLIENT][REQUEST] Sending resend request to backend", {
                    endpoint,
                    method,
                    maskedPhone,
                });
                const response = await fetch(endpoint, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    body: JSON.stringify({ phone: String(phone) }),
                });
                const durationMs = Math.round(performance.now() - startTime);
                const data = await response.json().catch(() => ({}));

                console.info("[SMS-CLIENT][RESPONSE] Resend OTP response received", {
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
                    if (data?.ttl) setSec(data.ttl);
                    alert(data?.message || "خطا در ارسال مجدد کد");
                    return;
                }
                setSec(data.ttl || 120);
                setCode("");
            }
        } catch (err: any) {
            console.error("[SMS-CLIENT][ERROR] Resend OTP failed", {
                endpoint,
                method,
                durationMs: Math.round(performance.now() - startTime),
                errorMessage: err?.message || "Network error",
            });
            if (!sendRoute) {
                alert(err?.message || "خطا در ارسال مجدد کد");
            }
        } finally {
            setSending(false);
            resendLockRef.current = false;
        }
    };

    const handleVerify = () => {
        if ((tiny && !verifyRoute) || code.length !== 6 || checking) return;
        const maskedPhone = maskClientPhone(String(phone));
        const startTime = performance.now();
        setChecking(true);

        console.info("[SMS-CLIENT][VERIFY_START] Submitting 6-digit OTP for verification", {
            endpoint: verifyRoute || "ServerAction:authUser",
            maskedPhone,
        });

        if (verifyRoute) {
            api(verifyRoute, { phone, code }, 'POST')
                .then(async (res: any) => {
                    console.info("[SMS-CLIENT][VERIFY_SUCCESS] OTP verified", {
                        endpoint: verifyRoute,
                        durationMs: Math.round(performance.now() - startTime),
                        traceId: res?.data?.traceId || null,
                    });
                    if (onVerify) await onVerify();
                })
                .catch((err: any) => {
                    console.error("[SMS-CLIENT][VERIFY_ERROR] OTP verification failed", {
                        endpoint: verifyRoute,
                        durationMs: Math.round(performance.now() - startTime),
                        message: err?.message || "خطا در تایید کد",
                    });
                    setChecking(false);
                    setCode("");
                });
            return;
        }

        authUser(String(phone), "sazeheman", code)
            .then(async () => {
                console.info("[SMS-CLIENT][VERIFY_SUCCESS] User authenticated via OTP", {
                    endpoint: "ServerAction:authUser",
                    durationMs: Math.round(performance.now() - startTime),
                    maskedPhone,
                });
                if (onVerify) {
                    await onVerify();
                } else {
                    router.push("/dashboard");
                    alert(`خوش آمدید`);
                }
            })
            .catch((err: any) => {
                console.error("[SMS-CLIENT][VERIFY_ERROR] OTP verification rejected", {
                    endpoint: "ServerAction:authUser",
                    durationMs: Math.round(performance.now() - startTime),
                    maskedPhone,
                    message: err?.message || "خطا در بررسی اطلاعات",
                });
                setChecking(false);
                setCode("");
                alert(err?.message || "خطا در بررسی اطلاعات");
            });
    };

    useDelayedEffect(() => {
        if (code.length !== 6) return;
        handleVerify();
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
                            <span className="mt-0.5" dir="ltr">
                                {String(phone || "")}
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
                    <CustomButton loading={sending} onClick={handleResend} className="small p-1! w-28 mx-auto">
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
                        onClick={handleVerify}
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
