'use client';

import React, {useState} from "react";
import {Swiper} from "swiper/types";
import {Swiper as SW, SwiperSlide} from "swiper/react";
import HeaderBlogPostItem from "@/app/(landing)/blog/components/HeaderBlogPostItem";
import {ActionIcon} from "@mantine/core";
import {IconlyArrowLeft2, IconlyArrowRight2} from "@/components/assets/iconpack";
import 'swiper/css';
import {useCache} from "@/context/CacheContext";
import {BlogPost} from "@/lib/api/base.type";

function Page() {
    const {blog: {posts: items = [] as BlogPost[]}} = useCache() as never;
    const [c, setC] = useState(0);
    const [swiper, setSwiper] = useState<Swiper>()

    return (
        <div className={'relative'}>

            <SW
                onSwiper={e => {
                    setSwiper(e);
                }}
                onSlideChange={e => {
                    setC(e.activeIndex);
                }}
            >
                {items.map((o, i) => (
                    <SwiperSlide key={i} className={'z-3'}>
                        <HeaderBlogPostItem post={o} />
                    </SwiperSlide>
                ))}
            </SW>
            <div
                className={'absolute p-3 bottom-5 mx-auto w-fit lg:w-3/5 3xl:w-2/5 left-0 right-0 flex items-center justify-center pt-2 container z-1'}>
                <div className={'w-auto mx-auto bg-black/30 p-1.5 px-2.5 rounded-full flex items-center gap-2'}>
                    {items.map((_, i) => (
                        <div className={'rounded-xl w-1.5 h-1.5 '} style={{
                            background: i === c ? "white" : "#0003"
                        }}/>
                    ))}
                </div>
                <div className={'py-2 items-center gap-3 hidden lg:flex absolute left-5'}>
                    <ActionIcon color={'var(--background)'} size={'lg'} radius={'xl'} onClick={() => {
                        swiper?.slidePrev()
                    }}>
                        <span className={c === 0 ? "text-b1" : 'text-black'}>
                            <IconlyArrowRight2/>
                        </span>
                    </ActionIcon>
                    <ActionIcon color={'var(--background)'} size={'lg'} radius={'xl'} onClick={() => {
                        swiper?.slideNext()
                    }}>
                        <span className={c === items.length - 1 ? "text-b1" : 'text-black'}>
                            <IconlyArrowLeft2/>
                        </span>
                    </ActionIcon>
                </div>
            </div>
        </div>
    )
}

export default Page;