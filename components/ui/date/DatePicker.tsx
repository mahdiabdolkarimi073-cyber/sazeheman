'use client';

import {useDelayedEffect} from "@/lib/hooks/useEffect";
import {Popover, PopoverDropdown, PopoverTarget, TextInput} from "@mantine/core";
import {ComponentProps, useEffect, useState} from "react";
import {Calendar, CalendarProvider} from "zaman";
import {IconEdit} from "../SVGs";

const CustomDatePicker = (props: Omit<Omit<ComponentProps<typeof TextInput>, 'onChange'>, "value"> & {
    value?: Date,
    onChange?: (date: Date) => void
}) => {
    const [date, setDate] = useState<Date | undefined>(props.value);

    useDelayedEffect(() => {
        if (date) props?.onChange?.(date);
    }, [date]);
    useEffect(()=>{
        if (props.defaultValue && typeof props.defaultValue === 'string') {
            setDate(new Date(props.defaultValue));
        }
    }, [props.defaultValue])

    return (
        <Popover closeOnEscape closeOnClickOutside withinPortal withRoles trapFocus >
            <PopoverTarget>
                <TextInput
                rightSection={<IconEdit stroke="#555" />}
                    {...props as any}
                    readOnly
                    value={date?.toLocaleDateString('fa').split("/").reverse().join(" / ")}
                />
            </PopoverTarget>
            <PopoverDropdown className="p-0! border-0! bg-transparent!">
                <div className="rounded-xl drop-shadow-xl">
                    <CalendarProvider locale="fa" round="x3" accentColor="#00BC7D">
                        <Calendar
                            defaultValue={date}
                            onChange={e => {
                                setDate(e?.value);
                            }}
                            // Somehow works
                            className="dark:invert dark:hue-rotate-180" 
                        />
                    </CalendarProvider>
                </div>
            </PopoverDropdown>
        </Popover>
    );
};

export default CustomDatePicker;