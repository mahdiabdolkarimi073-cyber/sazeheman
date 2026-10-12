'use client';

import React, {useState} from 'react';
import {Alert, TextInput} from "@mantine/core";
import {IconEdit, IconInfo, IconLink} from "@/components/ui/SVGs";
import CustomButton from "@/components/ui/base/CustomButton";
import FormComponent from "@/components/ui/base/FormComponent";
import {optimizeForm} from "@/lib/utils/global";
import {api} from "@/lib/api/base";
import useUser, {refetchUser} from "@/lib/hooks/useUser";

function Page() {
    const [loading, setLoading] = useState(false);
    const user = useUser();

    return (
        <div className="w-full max-w-lg" dir="rtl">
            <div className="text-right mb-8">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-[#E7F5EE] text-[#36B98A] text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36B98A]" />
                    تکمیل ثبت‌نام
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#173D35] mb-3 leading-tight">
                    اطلاعات تکمیلی
                </h1>
                <p className="text-sm text-[#6B7771]">
                    جهت تکمیل ثبت‌نام اطلاعات نمایشی خود را وارد نمایید
                </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={e => {
                e.preventDefault();
                const form = optimizeForm(e).toJson();
                setLoading(true);
                api("/profile/me", form, "POST")
                    .then(async () => {
                        await refetchUser();
                        window.location.href = "/dashboard";
                    })
                    .catch(() => {
                        setLoading(false);
                    })
            }}>
                <FormComponent
                    component={TextInput}
                    label={'نام کاربری'}
                    placeholder={'username'}
                    name={'slug'}
                    defaultValue={user?.slug || ""}
                    required
                    rightSection={(
                        <div className="gap-2 items-center flex justify-start">
                            <p className="opacity-80 text-sm" dir="ltr">Sazeheman.com/</p>
                            <IconLink stroke="currentColor" className="mb-1"/>
                        </div>
                    )}
                    classNames={{
                        wrapper: "flex",
                        input: "pl-32!",
                        section: "w-auto!"
                    }}
                    description={(
                        <div className="flex items-center gap-1">
                            <IconInfo/>
                            <p className="text-xs opacity-80">اسم نمایشی شما با لینک سازه من نشان داده خواهد
                                شد.</p>
                        </div>
                    )}
                    className="grow"
                    dir="ltr"
                    ta="right"
                />
                <FormComponent
                    component={TextInput}
                    required
                    label={'نام قابل نمایش'}
                    placeholder={'نام قابل نمایش خود را وارد کنید'}
                    className="grow min-w-[49%]"
                    rightSection={(
                        <div className="gap-3 items-center flex justify-start">
                            <IconEdit stroke="currentColor"/>
                        </div>
                    )}
                    name="nickname"
                    defaultValue={user?.nickname || ""}
                    classNames={{
                        wrapper: "flex",
                        input: "pl-32!",
                        section: "w-auto!"
                    }}
                />
                <Alert color="gray" className="text-black!"
                       icon={<IconInfo width={200} height={200} style={{width: "200px", height: "200px"}}/>}>
                    اسم نمایشی شما با لینک سازه من نشان داده خواهد شد. البته که بعدا میتونید آنرا تغییر دهید.
                </Alert>
                <CustomButton loading={loading} type="submit" className="w-full min-h-13!">
                    ورود
                </CustomButton>
            </form>
        </div>
    );
}

export default Page;
