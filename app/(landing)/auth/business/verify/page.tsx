'use client';

import React, {useState, useEffect} from 'react';
import {PinInput, Button} from '@mantine/core';
import CustomButton from '@/components/ui/base/CustomButton';
import {useRouter, useSearchParams} from 'next/navigation';
import {api} from '@/lib/api/base';
import {sleep} from '@/lib/utils/global';
import {useDelayedEffect} from '@/lib/hooks/useEffect';

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const phone = params.get('phone') || '';

    const [code, setCode] = useState('');
    const [sec, setSec] = useState(120);
    const [checking, setChecking] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (sec <= 0) return;
        sleep(1000).then(() => setSec((prev) => Math.max(0, prev - 1)));
    }, [sec]);

    const handleResend = () => {
        setSending(true);
        api('/business/sms-send', {phone}, 'POST')
            .then(() => {
                setSec(120);
                setCode('');
            })
            .finally(() => setSending(false));
    };

    useDelayedEffect(() => {
        if (code.length !== 6) return;
        setChecking(true);
        api('/business/sms-verify', {phone, code}, 'POST')
            .then(() => {
                router.push(`/auth/business/form?phone=${phone}`);
            })
            .catch(() => {
                setChecking(false);
                setCode('');
            });
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
                <p className="text-xs text-[#36B98A] mt-2">
                    (حالت تستی: هر کدی را وارد کنید تا تایید شود)
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
                    size="lg"
                >
                    تایید
                </Button>
            </div>
        </div>
    );
}

export default Page;
