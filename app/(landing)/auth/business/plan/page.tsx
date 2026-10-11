'use client';

import React, {useState, useEffect} from 'react';
import {Loader, Center} from '@mantine/core';
import CustomButton from '@/components/ui/base/CustomButton';
import {api} from '@/lib/api/base';
import {useRouter, useSearchParams} from 'next/navigation';
import {IconCheck} from '@/components/ui/SVGs';

type Plan = {
    id: string;
    name: string;
    price: number;
    features: string[];
};

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const businessId = params.get('business_id') || '';

    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string>('free');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api('/business/plans', {}, 'GET')
            .then((res) => setPlans(res.data?.plans || []))
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = () => {
        setSubmitting(true);
        api('/business/register', {business_id: businessId, plan: selected}, 'PUT')
            .catch(() => {})
            .finally(() => {
                router.push(`/auth/business/welcome?business_id=${businessId}&phone=${params.get('phone') || ''}`);
            });
    };

    if (loading) {
        return (
            <Center className="min-h-40">
                <Loader />
            </Center>
        );
    }

    return (
        <div className="flex flex-col gap-2 max-w-2xl w-full">
            <h3 className="text-3xl font-semibold">انتخاب پلن</h3>
            <p className="opacity-60">پلن مناسب کسب و کار خود را انتخاب کنید. پرداخت فعلا غیرفعال است و بعدا اضافه خواهد شد.</p>
            <br/>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`rounded-2xl border p-5 flex flex-col gap-3 cursor-pointer transition-all ${
                            selected === plan.id
                                ? 'border-primary bg-primary/5'
                                : 'border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => setSelected(plan.id)}
                    >
                        <h4 className="text-xl font-semibold">{plan.name}</h4>
                        <p className="text-2xl font-bold">
                            {plan.price === 0 ? 'رایگان' : `${plan.price.toLocaleString('fa')} تومان`}
                        </p>
                        <ul className="flex flex-col gap-2 text-sm">
                            {plan.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <IconCheck width={16} height={16} className="mt-0.5 shrink-0" />
                                    <span className="opacity-80">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <br/>
            <CustomButton loading={submitting} onClick={handleSelect} className="w-full">
                ادامه
            </CustomButton>
        </div>
    );
}

export default Page;
