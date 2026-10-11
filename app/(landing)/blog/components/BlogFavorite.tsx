import CustomButton from "@/components/ui/base/CustomButton";
import {IconBgFadedLine} from "@/components/ui/SVGs";
import React from "react";
import Image from "next/image";
import Link from "next/link";

function BlogFavorite(props: any) {
    return (
        <div className={'container mx-auto my-7 p-5 lg:p-0'}>
            <div className={'min-h-50 bg-container rounded-2xl grid grid-cols-1 lg:grid-cols-2'}>
                <div className={'flex items-center justify-center lg:px-10 p-5 lg:p-0 w-full'}>
                    <div className={'flex flex-col gap-3'}>
                        <h3 className={'text-4xl text-gradient font-bold py-3'}>مورد علاقه بهترینا</h3>
                        <p className={'opacity-80'}>
                            سازه من، پلتفرمی که به شما امکان می‌دهد با استفاده از ابزارهای قدرتمند و رابط کاربری ساده، صفحه ساختساز خود را بسازید و کسب درآمد کنید. با سازه من، شما می‌توانید به راحتی حمایت مالی دریافت کنید.
                        </p>
                        <div>
                            <Link href={"/dashboard/subscription"}>
                                <CustomButton shadow>
                                    خرید اشتراک
                                </CustomButton>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={'relative overflow-hidden'}>
                    <IconBgFadedLine />
                    <Image
                        width={1000}
                        height={1000}
                        src={'/pics/Bag.webp'}
                        alt={'bag'}
                        className={'absolute left-0 right-0 mx-auto top-0 object-contain w-full lg:w-[45%]'}
                    />
                </div>
            </div>
        </div>
    )
}

export default BlogFavorite;