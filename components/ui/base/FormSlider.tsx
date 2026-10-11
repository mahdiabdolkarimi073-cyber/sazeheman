'use client';

import ReadOnlyInput from "@/components/helper/ReadOnlyInput";
import {Slider} from "@mantine/core";
import {ComponentProps, useState} from "react";

function FormColorInput({ name, defaultChecked, ...props }: ComponentProps<typeof Slider>) {
    const [c, setC] = useState(props.defaultValue);
    const event = (e: number) => {
        setC(e)
    };

    return (
        <div>
            <Slider
                key={name}
                {...props}
                name={undefined}
                onChange={event}
            />
            <ReadOnlyInput name={name} value={c+""} />
        </div>
    )
}

export default FormColorInput;