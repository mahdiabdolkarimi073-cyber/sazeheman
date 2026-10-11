'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { api } from '@/lib/api/base';
import Link from 'next/link';
import Image from 'next/image';
import CustomButton from '@/components/ui/base/CustomButton';

type Ad = {
    id: string;
    business_name: string;
    title: string;
    description?: string;
    media_url: string;
    media_type: string;
    link_url?: string;
    phone?: string;
};

function AdsSlider() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api<{ads: Ad[]}>( "/ads")
            .then(e => setAds(e.data?.ads || []))
            .catch(() => setAds([]))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && ads.length === 0) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-primary" />
                    <h2 className="text-xl sm:text-2xl font-bold">تبلیغات مشاغل</h2>
                </div>
                <Link href="/dashboard/ads">
                    <CustomButton variant="soft" className="text-xs! sm:text-sm!">
                        ثبت تبلیغ شما
                    </CustomButton>
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-56 rounded-2xl bg-container animate-pulse" />
                    ))}
                </div>
            ) : (
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    slidesPerView={1}
                    spaceBetween={20}
                    loop={ads.length > 1}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="ads-slider !pb-10"
                >
                    {ads.map((ad) => (
                        <SwiperSlide key={ad.id}>
                            <div className="rounded-2xl overflow-hidden border border-b2 bg-background hover-lift h-full">
                                <div className="relative w-full h-40 sm:h-44 md:h-48 bg-container">
                                    {ad.media_type === "video" ? (
                                        <video
                                            src={ad.media_url}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                            playsInline
                                            onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                                            onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                                        />
                                    ) : (
                                        <Image
                                            src={ad.media_url}
                                            alt={ad.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="absolute top-3 right-3 bg-primary/90 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                                        تبلیغ
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col gap-2">
                                    <h3 className="font-bold text-base sm:text-lg truncate">{ad.title}</h3>
                                    <p className="text-sm opacity-70 line-clamp-2">{ad.description || ad.business_name}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs opacity-60">{ad.business_name}</span>
                                        {ad.link_url && (
                                            <Link href={ad.link_url}>
                                                <CustomButton variant="soft" className="text-xs! py-1! px-3!">
                                                    مشاهده
                                                </CustomButton>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}

export default AdsSlider;
