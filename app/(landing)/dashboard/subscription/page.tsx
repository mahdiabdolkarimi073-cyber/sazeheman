"use client";

import "swiper/css";
import {Button, LoadingOverlay, TextInput} from "@mantine/core";
import CustomButton from "@/components/ui/base/CustomButton";
import {Swiper, SwiperSlide} from "swiper/react";
import useDevice from "@/lib/hooks/useDevice";
import PlanItem from "./PlanItem";
import {useCache} from "@/context/CacheContext";
import {FullPlanType} from "@/app/(landing)/dashboard/subscription/PlanEnums";
import useUser, {refetchUser} from "@/lib/hooks/useUser";
import formModal, {FormModalBase} from "@/components/ui/modals/FormModal";
import {useState} from "react";
import {api} from "@/lib/api/base";
import {getUserPlanDays} from "@/lib/utils/global";


function Page() {
    const device = useDevice();
    const {plans = [] as FullPlanType[]} = useCache() as never;
    const user = useUser();
    const [loading, setLoading] = useState(false);

    const redeem = (code: string) => {
        if (!code) return;
        setLoading(true);
        api("/profile/plans/subscribe", {
            redeem: code
        }, "POST")
            .then(async ()=>{
                await refetchUser();
            })
            .finally(()=>{
                setLoading(false);
            })
    }

    return (
        <div className="h-full flex flex-col justify-stretch content-stretch relative">
            <LoadingOverlay visible={loading} />
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-2xl font-medium">اشتراک‌ها</h3>
                {device === "mobile" ? (
                    <Button
                        variant={"transparent"}
                        onClick={async () => {
                            const {code} = await formModal("فعالسازی با کد", (
                                <FormModalBase description={'کد فعالسازی اشتراک خود را وارد نمایید'}>
                                    <TextInput
                                        name={'code'}
                                        label="کد فعال‌سازی اشتراک"
                                        placeholder="کد فعال‌سازی را وارد کنید"
                                    />
                                </FormModalBase>
                            ));
                            redeem(code);
                        }}
                    >
                        فعالسازی با کد
                    </Button>
                ) : (
                    <form action={e => {
                        redeem(e.get('code')+"");
                    }}>
                        <TextInput
                            label="کد فعال‌سازی اشتراک"
                            placeholder="کد فعال‌سازی را وارد کنید"
                            classNames={{
                                wrapper: "w-auto!",
                                section: "w-auto!",
                                input: "pl-25! py-2! h-12!",
                            }}
                            name={'code'}
                            rightSection={
                                <div className="-ml-2">
                                    <CustomButton className="rounded-lg!  px-2 text-sm!" type={'submit'}>فعال‌سازی</CustomButton>
                                </div>
                            }
                        />
                    </form>
                )}
            </div>
            <br />
            <div className="flex items-stretch relative max-w-[90vw] grow flex-nowrap mx-auto lg:mx-0">
                <Swiper
                    dir="rtl"
                    slidesPerView={"auto"}
                    wrapperClass={"flex-nowrap justify-start lg:gap-5 w-full!"}
                    className="h-auto grow flex! items-start w-full!"
                >
                    {plans.map((plan, i) => {
                        return (
                            <SwiperSlide
                                key={i}
                                className={"h-auto! p-0! lg:w-auto! grow flex flex-col justify-center content-stretch"}
                            >
                                <div className="border bg-white/20 border-b2 h-full rounded-3xl p-4">
                                    <div className={'bg-white h-full'}>
                                        <PlanItem active={user?.plan === plan.key ? getUserPlanDays(user):undefined} plan={plan} />
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </div>
    );
}

export default Page;
