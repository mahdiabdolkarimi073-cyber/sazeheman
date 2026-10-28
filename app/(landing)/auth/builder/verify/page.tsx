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
    const projectId = params.get('project_id') || '';
    const phone = params.get('phone') || '';

    const [code, setCode] = useState('');
    const [sec, setSec] = useState(0);
    const [checking, setChecking] = useState(false);
    const [sending, setSending] = useState(false);
    const [autoSent, setAutoSent] = useState(false);
    const [missingInfo, setMissingInfo] = useState(false);
    const sentRef = useRef(false);
    const resendLockRef = useRef(false);

    useEffect(() => {
        if (!projectId || !phone) {
            setMissingInfo(true);
            return;
        }
        if (sentRef.current) return;
        sentRef.current = true;

        const endpoint = '/api/construction/sms-send';
        const startTime = performance.now();
        setSending(true);

        console.info('[SMS-CLIENT][REQUEST] Auto-sending construction OTP on mount', {
            endpoint,
            method: 'POST',
            maskedPhone: maskClientPhone(phone),
        });

        api('/construction/sms-send', {phone}, 'POST')
            .then((res: any) => {
                console.info('[SMS-CLIENT][RESPONSE] Construction OTP auto-send succeeded', {
                    endpoint,
                    method: 'POST',
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: res?.data?.traceId || null,
                });
                setSec(res?.data?.ttl || 120);
                setAutoSent(true);
            })
            .catch((err: any) => {
                console.error('[SMS-CLIENT][ERROR] Construction OTP auto-send failed', {
                    endpoint,
                    method: 'POST',
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: err?.data?.traceId || null,
                    errorCode: err?.data?.errorCode || null,
                    message: err?.message || 'خطا در ارسال پیامک',
                });
                setSec(0);
                setAutoSent(false);
            })
            .finally(() => setSending(false));
    }, [projectId, phone]);

    useEffect(() => {
        if (sec <= 0) return;
        sleep(1000).then(() => setSec((prev) => Math.max(0, prev - 1)));
    }, [sec]);

    const handleResend = () => {
        if (!phone || sending || resendLockRef.current) return;
        const endpoint = '/api/construction/sms-send';
        const startTime = performance.now();

        console.info('[SMS-CLIENT][CLICK] User clicked construction OTP resend', {
            endpoint,
            method: 'POST',
            maskedPhone: maskClientPhone(phone),
        });

        resendLockRef.current = true;
        setSending(true);
        api('/construction/sms-send', {phone}, 'POST')
            .then((res: any) => {
                console.info('[SMS-CLIENT][RESPONSE] Construction OTP resend succeeded', {
                    endpoint,
                    method: 'POST',
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: res?.data?.traceId || null,
                });
                setSec(res?.data?.ttl || 120);
                setAutoSent(true);
                setCode('');
            })
            .catch((err: any) => {
                console.error('[SMS-CLIENT][ERROR] Construction OTP resend failed', {
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
                resendLockRef.current = false;
            });
    };

    const handleVerify = () => {
        if (code.length !== 6 || checking) return;
        const endpoint = '/api/construction/sms-verify';
        const startTime = performance.now();
        setChecking(true);

        console.info('[SMS-CLIENT][VERIFY_START] Submitting construction OTP', {
            endpoint,
            method: 'POST',
            maskedPhone: maskClientPhone(phone),
        });

        api('/construction/sms-verify', {phone, code, project_id: projectId}, 'POST')
            .then((res: any) => {
                console.info('[SMS-CLIENT][VERIFY_SUCCESS] Construction OTP verified', {
                    endpoint,
                    method: 'POST',
                    durationMs: Math.round(performance.now() - startTime),
                    traceId: res?.data?.traceId || null,
                });
                try { sessionStorage.removeItem('builder_needs_selection'); } catch {}
                try { sessionStorage.removeItem('builder_project_form'); } catch {}
                router.push(`/dashboard/my-projects`);
            })
            .catch((err: any) => {
                console.error('[SMS-CLIENT][VERIFY_ERROR] Construction OTP verification failed', {
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

    if (missingInfo) {
        return (
            <div className="flex flex-col gap-4 justify-center max-w-sm">
                <h3 className="text-2xl text-center font-semibold">اطلاعات ناقص است</h3>
                <p className="opacity-60 text-center">
                    برای ورود به این مرحله باید ابتدا اطلاعات پروژه را ثبت کنید.
                </p>
                <CustomButton onClick={() => router.push('/auth/builder')} className="w-full">
                    بازگشت به ثبت پروژه
                </CustomButton>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 justify-center max-w-sm">
            <h3 className="text-2xl text-center lg:text-start font-semibold">تایید شماره تلفن</h3>
            <p className="opacity-60 text-center lg:text-start">
                کد ۶ رقمی ارسال شده به شماره <span dir="ltr">{phone}</span> را وارد کنید
            </p>

            {sending && !autoSent && (
                <p className="text-center opacity-50 text-sm">در حال ارسال کد...</p>
            )}

            <div className="flex items-stretch">
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

            {sec > 0 ? (
                <p className="text-center opacity-70 text-sm">
                    دریافت مجدد {sec.toLocaleString('fa')} ثانیه
                </p>
            ) : (
                <CustomButton
                    loading={sending}
                    onClick={handleResend}
                    className="small p-1! w-26 mx-auto"
                >
                    ارسال مجدد
                </CustomButton>
            )}

            <Button
                radius="xl"
                loading={checking}
                disabled={code.length !== 6}
                onClick={handleVerify}
            >
                تایید
            </Button>
        </div>
    );
}

export default Page;
