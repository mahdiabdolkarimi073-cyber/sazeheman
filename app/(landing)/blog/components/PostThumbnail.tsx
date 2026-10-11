import {IconFadedGrid, IconHeartLike} from "@/components/ui/SVGs";
import React from "react";

function PostThumbnail() {
    const color = "var(--container)"
    return (
        <div className={'absolute w-full h-full'} style={{
            background: color
        }}>
            <div className={'absolute w-full h-full flex items-center justify-center '}>
                <IconFadedGrid
                    width={undefined}
                    height={undefined}
                    style={{
                        minWidth: "max-content"
                    }}
                    className={'w-full h-[140%] grow '}
                />
            </div>
            <div className={'absolute left-0 top-0 w-full h-full flex items-center justify-center'}>
                <div
                    style={{
                        width: "589px",
                        height: "250px",
                        borderRadius: "100%",
                        background: "radial-gradient(62.74% 306.06% at 15.63% 60.23%, var(--background) 0%, var(--secondary) 30%, var(--primary) 70%, var(--background) 100%)",
                        filter: "blur(66.6484px)"
                    }}
                    className={'bg-blue-400 relative top-3/5'}
                />
            </div>

            <div
                className={'absolute w-full h-full flex items-center justify-center left-0 top-0'}>
                <IconHeartLike width={90} height={90} />
            </div>

        </div>
    )
}

export default PostThumbnail;