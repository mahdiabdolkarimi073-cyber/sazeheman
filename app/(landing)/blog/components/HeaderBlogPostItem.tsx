'use client';

import {IconFadedGrid, IconFolder2, IconHeartLike} from "@/components/ui/SVGs";
import CustomButton from "@/components/ui/base/CustomButton";
import {IconlyArrowLeft2} from "@/components/assets/iconpack";
import React, { useMemo } from "react";
import {BlogPost} from "@/lib/api/base.type";
import {echoTimeDiff} from "@/lib/utils/global";
import Link from "next/link";
import useTheme from "@/lib/hooks/useTheme";

function HeaderBlogPostItem({post, ...props}: {
    noBtn?: boolean,
    post: BlogPost
}) {
    const [theme] = useTheme();
    const isDark = useMemo(()=>theme === 'dark', [theme]);
    const color = "var(--background)";
    const Tag = props.noBtn ? "h1":"h3";


    return (
        <div className={'layout-gradient h-130 lg:h-180 relative'}>
            <div
                className={'absolute left-0 top-0 w-full flex items-center h-full'}
            >
                <div
                    style={{
                        background: color
                    }}
                    className={'w-full h-full absolute left-0 top-0 -z-11'}
                />
                <div style={{
                    width: "full",
                    background: "linear-gradient(90deg, var(--secondary) 10%, var(--primary) 70%)",
                    position: "absolute",
                    top: "0px",
                    left: "0",
                    right: 0,
                }} className='mx-auto h-full -z-10'/>
                <div style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(0deg, ${color} -1%, rgb(from ${color} r g b / 0.93) 30%,rgb(from ${color} r g b / 0.75) 70%,rgb(from ${color} r g b / 0.31) ${isDark ? "150":"100"}%)`,
                    position: "absolute",
                    top: "0px",
                    left: "0",
                    right: 0,
                }} className='mx-auto h-full -z-9'/>
                <div className={'relative mx-auto -z-3 overflow-hidden'} style={{width: "80%", height: "80%"}}>
                    <IconFadedGrid
                        width={undefined}
                        height={undefined}
                        style={{
                            width: "max-content"
                        }}
                        className={'w-full h-full relative mx-auto bottom-8'}
                    />
                    <div
                        className={'absolute w-full h-full flex items-center justify-center left-0 -top-1/4 lg:top-0'}>
                        <IconHeartLike/>
                    </div>
                </div>
                <div className={'absolute left-0 top-0 w-full h-full flex items-end justify-stretch p-5'}>
                    <div className={'container mx-auto py-4'}>
                        <div className={`${!props.noBtn && "max-w-100"} flex flex-col gap-2`}>
                            {!props.noBtn && (
                                <div className={'flex items-center gap-1'}>
                                    <IconFolder2/>
                                    <p className={'opacity-70'}>{post.category}</p>
                                </div>
                            )}
                            <div className={'flex justify-between items-center'}>
                                <Tag className={`${!props.noBtn && "max-w-60"} text-2xl lg:text-3xl font-semibold`}>
                                    {post.title}
                                </Tag>
                                {props.noBtn && (
                                    <p className={'opacity-70 whitespace-nowrap'}>{echoTimeDiff(post.created_at,false,true)}</p>
                                )}
                            </div>
                            <p className={'opacity-70'}>
                                {post.description}
                            </p>
                            {!props.noBtn && (
                                <Link href={'/blog/'+post.slug}>
                                    <CustomButton>
                                        مطالعه
                                        <IconlyArrowLeft2/>
                                    </CustomButton>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderBlogPostItem;