'use client';

import {Textarea} from "@mantine/core";
import {ComponentProps, useEffect, useState} from "react";
import { twMerge } from "tailwind-merge";

function CustomTextarea(props: ComponentProps<typeof Textarea>) {
    const [text, setText] = useState(props?.defaultValue?.toString() || props?.value?.toString() || undefined);

    useEffect(() => {
        if (props.value !== text) setText(props.value?.toString());
    }, [props.value])

    return (
        <div className={twMerge((props?.classNames as any)?.root, 'relative')}>
            <Textarea
                autosize
                maxLength={props.maxLength || 200}
                minRows={3}
                placeholder={'متن خود را بنویسید'}
                {...props}
                classNames={{
                    ...(props?.classNames || {}),
                    input: twMerge("pb-6!",(props?.classNames as any)?.input || "")
                }}
                value={text}
                onChange={e => {
                    setText(e.target?.value);
                    props.onChange?.(e);
                }}
            />
            {!!text?.length && (
                <p className={'absolute text-xs opacity-70 right-3 bottom-2'}>
                    {(text?.length || 0)?.toLocaleString('fa')}/{(props.maxLength || 200).toLocaleString('fa')}
                </p>
            )}
        </div>
    )
}

export default CustomTextarea;