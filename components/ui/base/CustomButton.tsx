'use client';

import React, {ComponentProps, useEffect, useState} from 'react';
import {twMerge} from "tailwind-merge";
import {customStyle} from "@/components/ui/utils";
import "style-ui/button.css"
import {Loader} from "@mantine/core";

function CustomButton(props: ComponentProps<'button'> & {
    variant?: "bordered" | "default" | 'soft';
    x?: number,
    y?: number,
    shadow?: boolean,
    bg?: string,
    color?: string,
    loading?: boolean,
    loadingColor?: string
} = {}) {

    const {x,y,shadow,variant,bg,color, loading: l1, ...others} = props;
    const [loading, setLoading] = useState(l1);

    useEffect(() => {
        setLoading(l1);
    }, [l1]);

    return (
        <button
            {...others}
            style={{
                ...customStyle({
                    "--y": y ? `${y}px`:undefined,
                    "--x": x ? `${x}px`:undefined,
                    "--color": color,
                    "--bg": bg
                }),
                ...others.style || {},
                boxShadow: shadow ? `0px 5px 20px -10px rgb(from var(--bg) r g b)`:undefined
            }}
            className={twMerge("cbutton justify-center", variant, loading ? "pointer-events-none":"", props?.className || "")}
            onClick={(e)=>{
                if (loading) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                const R = others.onClick?.(e) as any;
                if (!!R && typeof R === 'object' &&  R instanceof Promise) {
                    setLoading(true);
                    R.finally(()=>{
                        setLoading(false);
                    })
                }
            }}
            type={others.type || "button"}
        >
            {loading ? <Loader color={others.loadingColor || color || "white"} size={'sm'} />:others.children}
        </button>
    );
}

export default CustomButton;