'use client';

import React, {ComponentProps, ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {Popover, PopoverDropdown, PopoverTarget} from "@mantine/core";
import {IconlyArrowUp2} from "@/components/assets/iconpack";
import {twMerge} from "tailwind-merge";
import {useViewportSize} from '@mantine/hooks';

function CustomSelect(props: {
    data: {
        label: string | ReactNode,
        value: string,
        icon?: React.ReactNode,
        hint?: string
    }[],
    defaultValue?: string,
    defaultOpen?: boolean,
    placeholder?: string
    className?: string,
    classNames?: {
        target?: string,
        label?: string,
        indicator?: string,
        section?: string,
        dropdown?: string,
        labelArrow?: string,
        placeholder?: string,
        selectedLabel?: string
    }
    style?: ComponentProps<'div'>['style'],
    fullWidthDropdown?: boolean
    onChange?: (e: string) => any,
    name?: string,
    readOnly?: boolean,
    icon?: ReactNode
}) {
    const target = useRef<HTMLDivElement>(undefined as never);
    const [value, setValue] = useState<string | undefined>(props?.defaultValue as string);
    const disabled = useMemo(() => {
        return props.readOnly || props?.data?.length <= 1;
    }, [props])
    const [open, setOpen] = useState(props.defaultOpen);
    const selected = useMemo(() => {
        return props.data.find(o => o.value === value);
    }, [value, props]);
    const { width: scWidth } = useViewportSize();
    const [width, setWidth] = useState<number>();


    useEffect(() => {
        setOpen(() => false);
    }, [value, props]);
    useEffect(() => {
        setValue(props.defaultValue);
    }, [props.defaultValue]);
    useEffect(() => {
        if (!target.current) return;
        const width = target.current.offsetWidth;
        setWidth(width);
    }, [target.current, scWidth])

    return (
        <Popover
            onChange={() => setOpen(p => !p)}
            opened={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            closeOnClickOutside
            closeOnEscape
            disabled={disabled}
            position={'bottom-start'}
        >
            <PopoverTarget>
                <div
                    ref={target}
                    onClick={() => setOpen(!open)}
                    className={twMerge('border bg-input border-b1 rounded-xl py-3 px-3 cursor-pointer', props?.className, props.classNames?.target)}
                    style={props.style}
                >
                    <input hidden name={props.name} readOnly value={value || ""} />
                    <div
                        className={twMerge('w-full select-none flex justify-between items-center gap-2 flex-nowrap relative', props.classNames?.indicator)}>
                        {selected ? (
                            <div
                                className={twMerge('flex justify-start items-center gap-2 ', props.classNames?.section)}>
                                {selected?.icon || props.icon}
                                <div className="grow">
                                    <p className={twMerge('relative truncate flex gap-1 items-center w-full h-full', props.classNames?.label, props.classNames?.selectedLabel)} style={{
                                        top: "-1px"
                                    }}>
                                        <span>{selected.label}</span>
                                        {selected?.hint && (
                                            <span className='opacity-60'>({selected?.hint})</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div style={{maxWidth: "80%"}} className={twMerge('flex justify-start items-center gap-2 ', props.classNames?.section)}>
                                {props.icon || null}
                                <p  className={twMerge('text-sm opacity-60 truncate', props.classNames?.placeholder)}>{props.placeholder}</p>
                            </div>
                        )}
                        {!disabled && (
                            <div style={{
                                transform: `rotate(${open ? 0 : 180}deg)`
                            }} className={twMerge('transition-all', props.classNames?.labelArrow)}>
                                <IconlyArrowUp2 size={15} />
                            </div>
                        )}
                    </div>
                </div>
            </PopoverTarget>
            <PopoverDropdown className={'p-0! overflow-hidden'} style={{
                width: props.fullWidthDropdown ? `${width}px` : undefined
            }}>
                <div className={twMerge("w-full min-w-46 p-2 bg-container max-h-50 overflow-auto", props?.classNames?.dropdown)}>
                    {props.data.map((o, i) => (
                        <div className={'w-full flex justify-between items-center rounded-xl hover:bg-black/5 p-2 cursor-pointer'} key={i} onClick={() => {
                            setValue(o.value);
                            props?.onChange?.(o.value);
                        }}>
                            <div className={' flex items-center w-full justify-start gap-2'}>
                                {o?.icon}
                                <p className={twMerge('truncate max-w-4/5 text-sm flex gap-1', props.classNames?.label)}>
                                    {o.label}
                                    {selected?.hint && (
                                        <span className='opacity-60'>({selected?.hint})</span>
                                    )}
                                </p>

                            </div>
                            {selected?.value === o.value && (
                                <IconCheck color='currentColor' />
                            )}
                        </div>
                    ))}
                </div>
            </PopoverDropdown>
        </Popover>
    );
}

function IconCheck(props: ComponentProps<'svg'>) {
    return (
        <svg
            width={25}
            height={25}
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M8.5 12.879l6.894-6.895 1.061 1.06L8.5 15l-4.773-4.773 1.06-1.06L8.5 12.878z"
                fill={props.color || props.fill || "#09090B"}
            />
        </svg>
    )
}


export default CustomSelect;