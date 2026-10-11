'use client';

import {ComponentProps, InvalidEvent, JSXElementConstructor, useEffect, useMemo, useRef, useState} from "react";
import {Select} from '@mantine/core';
import useApiInfo from "@/lib/hooks/useApiInfo";

function FormComponent<T extends JSXElementConstructor<any>>({component: Component, ...props}: {
    component: T,
    apiKey?: string
} & ComponentProps<T>) {
    const apiKey = props.apiKey || props.name;
    const [info,clear] = useApiInfo(apiKey);
    const internalRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<boolean | string>(false);
    const removeRO = useMemo(() => {
        return Component.displayName === Select.displayName;
    }, [Component]);

    useEffect(() => {
        if (removeRO && internalRef.current) {
            const input = internalRef.current.querySelector('input') || internalRef.current;
            if (input) {
                input.removeAttribute('readonly');
            }
        }
    }, [removeRO]);


    useEffect(() => {
        if (!props.ref) return;

        if (typeof props.ref === 'function') {
            props.ref(internalRef.current);
        } else {
            props.ref.current = internalRef.current;
        }
    }, [props.ref]);
    useEffect(()=>{

        if (!info.errors?.length) return;

        setError(info.errors?.join(", ") || false);
    }, [info])

    return (
        <Component
            {...props}
            ref={internalRef}
            onInvalid={(e: InvalidEvent) => {
                e.preventDefault();
                props?.onInvalid?.(e);
                setError(true);
            }}
            error={error}
            onFocus={(e: FocusEvent) => {
                props?.onFocus?.(e);
                setError(false);
                clear();
            }}
            onKeyDown={removeRO ? (e: KeyboardEvent) => {
                e.preventDefault();
                props?.onKeyDown?.(e);
            } : props.onKeyDown}
            onInput={removeRO ? (e: KeyboardEvent) => {
                e.preventDefault();
            } : props.onInput}
            styles={removeRO ? {
                ...props.styles || {},
                input: {
                    ...props.styles?.input || {},
                    caretColor: 'transparent'
                }
            } : props.styles}
        />
    )
}

export default FormComponent;