'use client';

import React, {useState, useEffect, useRef} from 'react';
import {PinInput, Button} from '@mantine/core';
import CustomButton from '@/components/ui/base/CustomButton';
import {useRouter, useSearchParams} from 'next/navigation';
import {api} from '@/lib/api/base';
import {sleep} from '@/lib/utils/global';
import {useDelayedEffect} from '@/lib/hooks/useEffect';

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const projectId = params.get('project_id') || '';
    const phone = params.get('phone') || '';

    const [code, setCode] = useState('');
    const [sec, setSec] = useState(120);
    const [checking, setChecking] = useState(false);
    const [sending, setSending] = useState(false);
    const [autoSent, setAutoSent] = useState(false);
    const [missingInfo, setMissingInfo] = useState(false);
    const sentRef = useRef(false);

    useEffect(() => {
        if (!projectId || !phone) {
            setMissingInfo(true);
            return;
        }
        if (sentRef.current) return;
        sentRef.current = true;

        setSending(true);
        api('/construction/sms-send', {phone}, 'POST')
            .then(() => {
                setSec(120);
                setAutoSent(true);
            })
            .finally(() => setSending(false));
    }, [projectId, phone]);

    useEffect(() => {
        if (sec <= 0) return;
        sleep(1000).then(() => setSec((prev) => Math.max(0, prev - 1)));
    }, [sec]);

    const handleResend = () => {
        setSending(true);
        api('/construction/sms-send', {phone}, 'POST')
            .then(() => {
                setSec(120);
                setCode('');
            })
            .finally(() => setSending(false));
    };

    useDelayedEffect(() => {
        if (code.length !== 6) return;
        setChecking(true);
        api('/construction/sms-verify', {phone, code, project_id: projectId}, 'POST')
            .then(() => {
                try { sessionStorage.removeItem('builder_needs_selection'); } catch {}
                router.push(`/`);
                window.alert('ثبت نام پروژه شما با موفقیت تکمیل شد! پس از تایید ادمین، پروژه شما روی نقشه نمایش داده خواهد شد.');
            })
            .catch(() => {
                setChecking(false);
                setCode('');
            });
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
            >
                تایید
            </Button>
        </div>
    );
}

export default Page;
