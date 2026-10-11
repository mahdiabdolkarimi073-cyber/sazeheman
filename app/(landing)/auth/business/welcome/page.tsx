'use client';

import React, {useEffect} from 'react';
import {IconCheck} from '@/components/ui/SVGs';
import CustomButton from '@/components/ui/base/CustomButton';
import {useRouter, useSearchParams} from 'next/navigation';
import {authUser} from '@/app/(landing)/auth/action';

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const phone = params.get('phone') || '';

    useEffect(() => {
        if (phone) {
            authUser(+phone, 'shoghlman').catch(console.error);
        }
    }, [phone]);

    return (
        <div className="flex flex-col gap-4 max-w-md w-full items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <IconCheck width={48} height={48} />
            </div>
            <h3 className="text-3xl font-semibold">خوش آمدید!</h3>
            <p className="opacity-60 text-lg">
                ثبت نام شغل شما با موفقیت انجام شد. پس از بررسی و تایید مدیر، کسب و کار شما منتشر خواهد شد.
            </p>
            <p className="opacity-50 text-sm">
                در انتظار تایید هستیم - به زودی کسب و کار شما در لیست نمایش داده خواهد شد
            </p>
            <br/>
            <CustomButton className="w-full" onClick={() => router.push('/dashboard')}>
                ورود به داشبورد شغل من
            </CustomButton>
        </div>
    );
}

export default Page;
