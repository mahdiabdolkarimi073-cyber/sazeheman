'use client';

import React, {useState, useEffect} from 'react';
import {Textarea, Checkbox, Loader, Center} from '@mantine/core';
import CustomButton from '@/components/ui/base/CustomButton';
import {api} from '@/lib/api/base';
import {useRouter, useSearchParams} from 'next/navigation';

type Job = {
    id: string;
    name: string;
    slug: string;
    icon?: string;
};

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const projectId = params.get('project_id') || '';

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Record<string, { checked: boolean; description: string }>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api('/construction/jobs', {}, 'GET')
            .then((res) => {
                setJobs(res.data?.jobs || []);
                const initial: Record<string, { checked: boolean; description: string }> = {};
                for (const job of res.data?.jobs || []) {
                    initial[job.id] = {checked: false, description: ''};
                }
                setSelected(initial);
            })
            .finally(() => setLoading(false));
    }, []);

    const toggleJob = (jobId: string) => {
        setSelected((prev) => ({
            ...prev,
            [jobId]: {...prev[jobId], checked: !prev[jobId].checked},
        }));
    };

    const setDescription = (jobId: string, description: string) => {
        setSelected((prev) => ({
            ...prev,
            [jobId]: {...prev[jobId], description},
        }));
    };

    const handleSubmit = () => {
        const needs = Object.entries(selected)
            .filter(([, v]) => v.checked)
            .map(([jobId, v]) => ({
                job_id: jobId,
                description: v.description || undefined,
            }));

        if (needs.length === 0) {
            window.alert('حداقل یک شغل انتخاب کنید');
            return;
        }

        setSubmitting(true);
        api('/construction/needs', {project_id: projectId, needs}, 'POST')
            .then(() => {
                window.alert('ثبت نام با موفقیت تکمیل شد! پس از تایید ادمین پروژه شما روی نقشه نمایش داده می‌شود.');
                router.push('/');
            })
            .finally(() => setSubmitting(false));
    };

    if (loading) {
        return (
            <Center className="min-h-40">
                <Loader />
            </Center>
        );
    }

    const selectedCount = Object.values(selected).filter((v) => v.checked).length;

    return (
        <div className="flex flex-col gap-2 max-w-2xl w-full">
            <h3 className="text-3xl font-semibold">انتخاب نیازهای پروژه</h3>
            <p className="opacity-60">
                مشاغل مورد نیاز پروژه خود را انتخاب کنید. برای هر شغل می‌توانید توضیحات بیشتری بنویسید.
            </p>
            <p className="text-sm text-primary">
                {selectedCount.toLocaleString('fa')} شغل انتخاب شده
            </p>
            <br/>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        className={`rounded-xl border p-4 transition-all ${
                            selected[job.id]?.checked
                                ? 'border-primary bg-primary/5'
                                : 'border-white/10'
                        }`}
                    >
                        <Checkbox
                            label={job.name}
                            checked={selected[job.id]?.checked || false}
                            onChange={() => toggleJob(job.id)}
                            classNames={{label: 'font-medium'}}
                        />
                        {selected[job.id]?.checked && (
                            <Textarea
                                placeholder="توضیحات بیشتر (اختیاری)"
                                value={selected[job.id]?.description || ''}
                                onChange={(e) => setDescription(job.id, e.currentTarget.value)}
                                autosize
                                minRows={1}
                                className="mt-2"
                                size="xs"
                            />
                        )}
                    </div>
                ))}
            </div>

            <br/>
            <CustomButton loading={submitting} onClick={handleSubmit} className="w-full">
                تکمیل ثبت نام
            </CustomButton>
        </div>
    );
}

export default Page;
