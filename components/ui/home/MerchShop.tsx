'use client';

import React, {useState} from 'react';
import type {Swiper as C} from "swiper";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import Image from "next/image";
import {IconArrowUpLeft} from "@/components/ui/SVGs";
import CustomButton from "@/components/ui/base/CustomButton";
import {FreeMode} from "swiper/modules";
import {IconlyArrowRight2} from "@/components/assets/iconpack";
import {Button} from '@mantine/core';


function MerchShop() {
    const [swiper, setSwiper] = useState<C>();
    const [active, setActive] = useState(0);
    const slides = Array.from({ length: 10 });

    return (
        <div className={'text-white'}>
            <div className={'flex-wrap flex justify-between items-end xl:p-7 2xl:p-12 p-3'}>
                <div>
                    <h3 className={'text-3xl font-semibold'}>
                        فروش مرچ مستقیم در سازه من
                    </h3>
                    <p>
                        هودی، تیشرت و ماگ با چاپ سفارشی؛ سفارش‌ها مستقیم برای هوادار ارسال می‌شود
                    </p>
                </div>
                <CustomButton bg={'black'} color={'white'}>
                    مشاهده فروشگاه
                </CustomButton>
            </div>
            <br />
            <div className={'relative'}>
                <div
                    style={{
                        width: "100px",
                        background: "linear-gradient(90deg, #80d4a8 -20%,transparent 70%)",
                        zIndex: 2
                    }}
                    className={'absolute left-0 top-0 h-full opacity-80'}
                />
                <Swiper
                    freeMode
                    dir="rtl"
                    slidesPerView={'auto'}
                    spaceBetween={30}
                    onSlideChange={(e) => {

                        setActive(e.activeIndex)
                    }}
                    initialSlide={active}
                    onSwiper={setSwiper}
                    slidesOffsetBefore={50}
                    modules={[FreeMode]}
                    // breakpoints={{
                    //     600: {
                    //         slidesPerView: 2,
                    //     },
                    //     1000: {
                    //         slidesPerView: 4,
                    //     },
                    //     1600: {
                    //         slidesPerView: 6,
                    //     },
                    //     1900: {
                    //         slidesPerView: 8,
                    //     }
                    // }}
                    height={304}
                >
                    {slides.map((_, i) => (
                        <SwiperSlide key={i} className={'max-w-[280px]'}>
                            <div className="rounded-xl relative bg-container w-[280px] pt-5 overflow-hidden">
                                <div className={'flex p-3 absolute top-0 right-0'}>
                                    <div className={'bg-gray-400/90 flex items-center gap-2 rounded-full p-1'}>
                                        <Image src={'/pics/design/merch-shop.png'} alt={'merch-shop'} height={32}
                                            width={32} />
                                        <p className={'pl-3 text-sm'}>نام فروشگاه</p>
                                    </div>
                                </div>
                                <div className={'flex p-3 absolute bottom-0 right-0'}>
                                    <Button variant={'soft'} className={'text-white! bg-transparent!'}>

                                        مشاهده
                                        <IconArrowUpLeft />
                                    </Button>
                                </div>
                                <Image src={'/pics/design/merch.png'} alt={'merch'} width={280} height={290} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className={'w-full flex justify-end xl:p-7 2xl:p-12 p-3'}>
                <div className={'flex gap-2 justify-start'}>
                    <CustomButton disabled={active === 0} className={'p-1!'} bg={'white'} onClick={() => {
                        swiper?.slideTo(swiper.activeIndex - 1)
                    }} color={'black'}>
                        <div className={'relative left-0.5'}>
                            <IconlyArrowRight2 />
                        </div>
                    </CustomButton>
                    <CustomButton onClick={() => {
                        swiper?.slideTo(swiper.activeIndex + 1)
                    }} className={'p-1!'} bg={'white'} color={'black'}>
                        <div className={'relative right-0.5 rotate-180'}>
                            <IconlyArrowRight2 />
                        </div>
                    </CustomButton>
                </div>
            </div>
        </div>
    );
}

export default MerchShop;