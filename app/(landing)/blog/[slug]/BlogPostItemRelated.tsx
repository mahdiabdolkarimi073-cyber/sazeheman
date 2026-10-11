'use client';

import React, {useState} from "react";
import type {Swiper} from "swiper/types";
import {Swiper as SW, SwiperSlide} from "swiper/react";
import {ActionIcon} from "@mantine/core";
import {IconlyArrowLeft2, IconlyArrowRight2} from "@/components/assets/iconpack";
import PostItem from "@/app/(landing)/blog/components/PostItem";
import {BlogPost} from "@/lib/api/base.type";
import EmptyList from "@/components/helper/EmptyList";

function BlogPostItemRelated({items = [] as BlogPost[]}) {
    const [c, setC] = useState(0);
    const [swiper, setSwiper] = useState<Swiper>()

    return (
        <div className={'relative w-full'}>
            {!items.length && (
                <EmptyList
                    text={'مطلبی یافت نشد'}
                />
            )}
            <SW
                onSwiper={e => {
                    setSwiper(e);
                }}
                onSlideChange={e => {
                    setC(e.activeIndex);
                }}
                centeredSlides={true}
                slidesPerView={'auto'}
                freeMode
                spaceBetween={30}
                breakpoints={{
                    1000: {
                        slidesOffsetAfter: 230,
                        centeredSlides: false,
                        spaceBetween: 0
                    }
                }}
                slidesOffsetAfter={0}
                className={'overflow-visible!'}
                wrapperClass={'lg:gap-8'}
            >
                {items.map((o, i) => (
                    <SwiperSlide key={i} className={'w-auto!'}>
                        <PostItem post={o} />
                    </SwiperSlide>
                ))}
            </SW>
            <div
                className={'mt-5 flex items-center justify-end pt-2  container z-90'}>
                <div className={'items-center gap-3 hidden lg:flex '}>
                    <ActionIcon color={"var(--background)"} size={'lg'} radius={'xl'} onClick={() => {
                        swiper?.slidePrev()
                    }}>
                        <span className={`text-black ${c === 0 && "opacity-40"}`}>
                            <IconlyArrowRight2/>
                        </span>
                    </ActionIcon>
                    <ActionIcon color={'var(--background)'} size={'lg'} radius={'xl'} onClick={() => {
                        swiper?.slideNext()
                    }}>
                        <span className={`text-black ${c === items.length - 1 && "opacity-40"}`}>
                            <IconlyArrowLeft2/>
                        </span>
                    </ActionIcon>
                </div>
            </div>
        </div>
    )
}

export default BlogPostItemRelated;