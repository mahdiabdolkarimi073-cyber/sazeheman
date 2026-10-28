'use client';
import React, {useState, useEffect, useRef} from 'react';
import {PinInput, Button} from '@mantine/core';
import CustomButton from '@/components/ui/base/CustomButton';
import {useRouter, useSearchParams} from 'next/navigation';
import {api} from '@/lib/api/base';
import {sleep} from '@/lib/utils/global';
import {useDelayedEffect} from '@/lib/hooks/useEffect';

function maskClientPhone(phone: string): string {
    const str = String(phone || '').trim();
    if (str.length < 7) return '***';
    return `${str.slice(0, 4)}***${str.slice(-4)}`;
}

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const phone = params.get('phone') || '';

    const [code, setCode] = useState('');
    const [sec, setSec] = useState(120);
    const [checking, setChecking] = useState(false);
    const [sending, setSending] = useState(false);
    const inFlightRef = useRef(false);

    useEffect(() => {
        if (sec <= 0) return;
        sleep(1000).then(() => setSec((prev) => Math.max(0, prev - 1)));
    }, [sec]);

    const handleResend = () => {
        if (!phone || sending || inFlightRef.current) return;
        const endpoint = '/api/business/sms-send';
        const startTime = performance.now();

        console.info('[SMS-CLIENT][CLICK] User clicked business OTP resend', {
            endpoint,
            method: 'POST',
            maskedPhone: maskClientPhone(phone),
        });

        inFlightRef.current = true;
        setSending(true);
        api('/business/sms-send', {phone}, 'POST')
            .then((res: any) => {
                console.info('[SMS-CLIENT][RESPONSE] Business OTP resend succeeded', {
                    endpoint,
                    method: 'POST',
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: res?.data?.traceId || null,
                });
                setSec(res?.data?.ttl || 120);
                setCode('');
            })
            .catch((err: any) => {
                console.error('[SMS-CLIENT][ERROR] Business OTP resend failed', {
                    endpoint,
                    method: 'POST',
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: err?.data?.traceId || null,
                    errorCode: err?.data?.errorCode || null,
                    message: err?.message || 'خطا در ارسال پیامک',
                });
            })
            .finally(() => {
                setSending(false);
                inFlightRef.current = false;
            });
    };

    const handleVerify = () => {
        if (code.length !== 6 || checking) return;
        const endpoint = '/api/business/sms-verify';
        const startTime = performance.now();
        setChecking(true);

        console.info('[SMS-CLIENT][VERIFY_START] Submitting business OTP', {
            endpoint,
            method: 'POST',
            maskedPhone: maskClientPhone(phone),
        });

        api('/business/sms-verify', {phone, code}, 'POST')
            .then((res: any) => {
                console.info('[SMS-CLIENT][VERIFY_SUCCESS] Business OTP verified', {
                    endpoint,
                    method: 'POST',
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: res?.data?.traceId || null,
                });
                router.push(`/auth/business/form?phone=${encodeURIComponent(phone)}`);
            })
            .catch((err: any) => {
                console.error('[SMS-CLIENT][VERIFY_ERROR] Business OTP verification failed', {
                    endpoint,
                    method: 'POST',
                    durationMs: Math.round(performance.now() - startTime),
                    message: err?.message || 'خطا در تایید کد',
                });
                setChecking(false);
                setCode('');
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
                    شغل من
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#173D35] mb-3 leading-tight">
                    تایید شماره تلفن
                </h1>
                <p className="text-sm text-[#6B7771]">
                    کد ۶ رقمی ارسال شده به شماره <span dir="ltr">{phone}</span> را وارد کنید
                </p>
            </div>

            <div className="flex items-stretch mb-8">
                <PinInput
                    disabled={checking}
                    length={6}
                    value={code}
                    placeholder=""
                    type="number"
                    autoFocus
                    name="code"
                    classNames={{pinInput: 'w-full!'}}
                    onChange={setCode}
                    size="md"
                    radius="md"
                    className="w-full justify-stretch!"
                />
            </div>

            <div className="flex flex-col gap-5">
                {sec > 0 ? (
                    <p className="text-center text-[#6B7771] text-sm">
                        دریافت مجدد {sec.toLocaleString('fa')} ثانیه
                    </p>
                ) : (
                    <CustomButton
                        loading={sending}
                        onClick={handleResend}
                        className="small p-1! w-28 mx-auto"
                    >
                        ارسال مجدد
                    </CustomButton>
                )}

                <Button
                    radius="xl"
                    loading={checking}
                    disabled={code.length !== 6}
                    onClick={handleVerify}
                    size="lg"
                >
                    تایید
                </Button>
            </div>
        </div>
    );
}

export default Page;
