import PostThumbnail from "@/app/(landing)/blog/components/PostThumbnail";
import {IconFolder2} from "@/components/ui/SVGs";
import {BlogPost} from "@/lib/api/base.type";
import {echoTimeDiff, Throw} from "@/lib/utils/global";
import React from "react";
import Link from "next/link";


function PostItem({post = Throw("POST") as BlogPost}) {
    return (
        <Link href={'/blog/'+post?.slug}>
            <div className={'relative flex flex-col gap-3 min-w-90'}>
                <div className={'relative grow min-h-50 rounded-2xl overflow-hidden'}>
                    <PostThumbnail/>
                </div>
                <div className={'flex items-center justify-between'}>
                    <div className={'flex items-center gap-2'}>
                        <IconFolder2/>
                        <p className={'opacity-70 text-sm'}>{post?.category}</p>
                    </div>
                    <p className={'opacity-70 text-sm'}>{echoTimeDiff(post?.created_at || new Date(), false, true)}</p>
                </div>
                <h4 className={'font-semibold text-xl'}>{post?.title}</h4>
            </div>
        </Link>
    )
}

export default PostItem;