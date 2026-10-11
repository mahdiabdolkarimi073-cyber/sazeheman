'use client';

import React from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay} from "swiper/modules";
import 'swiper/css';
import {FullPlanType} from "@/app/(landing)/dashboard/subscription/PlanEnums";
import {useCache} from "@/context/CacheContext";
import PlanItem from "@/app/(landing)/dashboard/subscription/PlanItem";
import CustomButton from "@/components/ui/base/CustomButton";
import Link from "next/link";


function PlanList(props: { white?: boolean }) {
    const {plans = [] as FullPlanType[]} = useCache() as never;
    return (
        <div id="plans" className="relative py-20 bg-background overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />

            <div className="relative z-10 flex flex-col gap-4 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-medium mb-4">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        تعرفه‌ها
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-extrabold max-w-md text-center mb-3">
                        همین الان صفحه ساخت‌ساز اختصاصی‌ت رو بساز!
                    </h3>
                    <p className="text-sm opacity-60 max-w-sm text-center">
                        از بین پلن‌های متنوع سازه من بسته به نیاز خودت بهترین پلن رو انتخاب کن
                    </p>
                </div>

                <Link href="/plans">
                    <CustomButton variant="soft" className="px-6! py-2.5! mb-6">
                        مشاهده کامل تعرفه‌ها
                    </CustomButton>
                </Link>

                <div className="relative w-full">
                    <Swiper
                        dir="rtl"
                        slidesPerView={'auto'}
                        spaceBetween={24}
                        wrapperClass={'xl:justify-center'}
                        modules={[Autoplay]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                    >
                        {plans.map((plan, i) => (
                            <SwiperSlide key={i} className={'h-auto! max-w-[320px]'}>
                                <div className="glass-card rounded-3xl p-4 h-full hover-lift"
                                     style={{ minHeight: "320px", width: "320px" }}>
                                    <div className="bg-background rounded-2xl">
                                        <PlanItem plan={plan}/>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default PlanList;
