'use client';

import React, {useState, useEffect} from 'react';
import {Textarea, Checkbox, Alert, Loader, Center} from '@mantine/core';
import {IconInfoCircle} from '@/components/assets/tabler-icons';
import CustomButton from '@/components/ui/base/CustomButton';
import {useRouter, useSearchParams} from 'next/navigation';
import {api} from '@/lib/api/base';

type Job = {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
};

type Selection = Record<string, { checked: boolean; description: string }>;

const STORAGE_KEY = 'builder_needs_selection';

function loadSelection(jobs: Job[]): Selection {
    const empty = Object.fromEntries(jobs.map((j) => [j.id, {checked: false, description: ''}]));
    if (typeof window === 'undefined') return empty;
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Selection;
            return Object.fromEntries(jobs.map((j) => [j.id, parsed[j.id] || {checked: false, description: ''}]));
        }
    } catch {}
    return empty;
}

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const projectId = params.get('project_id') || '';
    const phone = params.get('phone') || '';

    const [jobs, setJobs] = useState<Job[]>([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [selected, setSelected] = useState<Selection>({});
    const [submitting, setSubmitting] = useState(false);
    const [showError, setShowError] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        api('/construction/jobs', {}, 'GET')
            .then((res) => {
                const jobList: Job[] = res.data?.jobs || [];
                setJobs(jobList);
                setSelected(loadSelection(jobList));
            })
            .finally(() => setJobsLoading(false));
    }, []);

    useEffect(() => {
        if (jobs.length > 0) {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
            } catch {}
        }
    }, [selected, jobs.length]);

    const toggleJob = (jobId: string) => {
        setShowError(false);
        setSelected((prev) => ({
            ...prev,
            [jobId]: {...prev[jobId], checked: !prev[jobId]?.checked},
        }));
    };

    const setDescription = (jobId: string, description: string) => {
        setSelected((prev) => ({
            ...prev,
            [jobId]: {...prev[jobId], description},
        }));
    };

    const selectedCount = Object.values(selected).filter((v) => v.checked).length;

    const handleContinue = async () => {
        if (selectedCount === 0) {
            setShowError(true);
            return;
        }

        setSubmitting(true);
        setSaveError(null);

        const needsPayload = jobs
            .filter((j) => selected[j.id]?.checked)
            .map((j) => ({
                job_id: j.id,
                description: selected[j.id]?.description || undefined,
            }));

        try {
            await api('/construction/needs', {
                project_id: projectId,
                needs: needsPayload,
            }, 'POST').catch(() => {});
        } catch {}

        setSubmitting(false);
        router.push(`/auth/builder/verify?project_id=${projectId}&phone=${phone}`);
    };

    const handleBack = () => {
        router.push(`/auth/builder?project_id=${projectId}&phone=${phone}`);
    };

    if (jobsLoading) {
        return (
            <Center className="min-h-40">
                <Loader />
            </Center>
        );
    }

    return (
        <div className="flex flex-col gap-2 max-w-2xl w-full">
            <h3 className="text-2xl lg:text-3xl font-semibold">انتخاب مشاغل مورد نیاز پروژه</h3>
            <p className="opacity-60 text-sm">
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

            {saveError && (
                <Alert color="orange" variant="light" icon={<IconInfoCircle size={18} />}>
                    {saveError}
                </Alert>
            )}

            {jobs.length === 0 ? (
                <p className="opacity-50 text-center py-8">هنوز شغلی تعریف نشده است.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className={`rounded-xl border p-4 transition-all cursor-pointer ${
                                selected[job.id]?.checked
                                    ? 'border-primary bg-primary/5'
                                    : 'border-white/10 hover:border-white/20'
                            }`}
                            onClick={() => toggleJob(job.id)}
                        >
                            <Checkbox
                                label={job.name}
                                checked={selected[job.id]?.checked || false}
                                onChange={() => toggleJob(job.id)}
                                classNames={{label: 'font-medium cursor-pointer'}}
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
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

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
        </div>
    );
}

export default Page;
