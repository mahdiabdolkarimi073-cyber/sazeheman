'use client';

import React, {useState, useEffect} from 'react';
import {Textarea, Checkbox, Alert} from '@mantine/core';
import {IconInfoCircle} from '@tabler/icons-react';
import CustomButton from '@/components/ui/base/CustomButton';
import {useRouter, useSearchParams} from 'next/navigation';

const TEMP_JOBS = [
    'اسکلت و سازه',
    'معماری و طراحی',
    'برق ساختمان',
    'لوله‌کشی و تأسیسات',
    'گچ‌کاری',
    'کاشی و سرامیک',
    'نقاشی ساختمان',
    'در و پنجره',
    'آسانسور',
    'محوطه‌سازی',
];

const STORAGE_KEY = 'builder_needs_selection';

type Selection = Record<number, { checked: boolean; description: string }>;

function loadSelection(): Selection {
    if (typeof window === 'undefined') {
        return Object.fromEntries(TEMP_JOBS.map((_, i) => [i, {checked: false, description: ''}]));
    }
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Selection;
            return Object.fromEntries(TEMP_JOBS.map((_, i) => [
                i,
                parsed[i] || {checked: false, description: ''},
            ]));
        }
    } catch {}
    return Object.fromEntries(TEMP_JOBS.map((_, i) => [i, {checked: false, description: ''}]));
}

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const projectId = params.get('project_id') || '';
    const phone = params.get('phone') || '';

    const [selected, setSelected] = useState<Selection>(loadSelection);
    const [submitting, setSubmitting] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
        } catch {}
    }, [selected]);

    const toggleJob = (index: number) => {
        setShowError(false);
        setSelected((prev) => ({
            ...prev,
            [index]: {...prev[index], checked: !prev[index].checked},
        }));
    };

    const setDescription = (index: number, description: string) => {
        setSelected((prev) => ({
            ...prev,
            [index]: {...prev[index], description},
        }));
    };

    const selectedCount = Object.values(selected).filter((v) => v.checked).length;

    const handleContinue = () => {
        if (selectedCount === 0) {
            setShowError(true);
            return;
        }

        setSubmitting(true);
        router.push(`/auth/builder/verify?project_id=${projectId}&phone=${phone}`);
    };

    const handleBack = () => {
        router.push(`/auth/builder?project_id=${projectId}&phone=${phone}`);
    };

    return (
        <div className="flex flex-col gap-2 max-w-2xl w-full">
            <h3 className="text-3xl font-semibold">انتخاب مشاغل مورد نیاز پروژه</h3>
            <p className="opacity-60">
                مشاغلی که برای پروژه خود نیاز دارید را انتخاب کنید. می‌توانید چند شغل را هم‌زمان انتخاب کنید و برای هر کدام توضیحات بنویسید.
            </p>

            <div className="flex items-center justify-between">
                <p className="text-sm text-primary">
                    {selectedCount.toLocaleString('fa')} شغل انتخاب شده
                </p>
                <span className="text-xs opacity-50">مرحله ۲ از ۳</span>
            </div>
            <br/>

            {showError && (
                <Alert
                    color="red"
                    variant="light"
                    icon={<IconInfoCircle size={18} />}
                    onClose={() => setShowError(false)}
                    withCloseButton
                >
                    حداقل یک شغل باید انتخاب شود تا بتوانید ادامه دهید.
                </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMP_JOBS.map((jobName, index) => (
                    <div
                        key={index}
                        className={`rounded-xl border p-4 transition-all cursor-pointer ${
                            selected[index]?.checked
                                ? 'border-primary bg-primary/5'
                                : 'border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => toggleJob(index)}
                    >
                        <Checkbox
                            label={jobName}
                            checked={selected[index]?.checked || false}
                            onChange={() => toggleJob(index)}
                            classNames={{label: 'font-medium cursor-pointer'}}
                        />
                        {selected[index]?.checked && (
                            <Textarea
                                placeholder="توضیحات بیشتر (اختیاری)"
                                value={selected[index]?.description || ''}
                                onChange={(e) => setDescription(index, e.currentTarget.value)}
                                autosize
                                minRows={1}
                                className="mt-2"
                                size="xs"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>
                ))}
            </div>

            <br/>
            <div className="flex flex-col sm:flex-row gap-3">
                <CustomButton
                    variant="outline"
                    onClick={handleBack}
                    className="w-full sm:w-auto"
                >
                    بازگشت و ویرایش پروژه
                </CustomButton>
                <CustomButton
                    loading={submitting}
                    onClick={handleContinue}
                    className="w-full sm:flex-1"
                >
                    ادامه و تأیید شماره
                </CustomButton>
            </div>

            <p className="text-xs opacity-40 mt-2">
                این فهرست موقت و صرفاً برای تست است. مشاغل واقعی پس از راه‌اندازی پنل مدیریت اضافه خواهند شد.
            </p>
        </div>
    );
}

export default Page;
