'use client';

import ReadOnlyInput from "@/components/helper/ReadOnlyInput";
import {ColorInput} from "@mantine/core";
import {ComponentProps, useState} from "react";

function FormColorInput({ name, defaultChecked, checked, ...props }: ComponentProps<typeof ColorInput>) {
    const [c, setC] = useState(props.defaultValue);
    const event = (e: string) => {
        setC(e)
    };

    return (
        <div>
            <ColorInput
                key={name}
                {...props}
                classNames={{
                    section: "pointer-events-none!"
                }}
                required={false}
                name={undefined}
                onChange={event}
            />
            <ReadOnlyInput name={name} value={c} />
        </div>
    )
}

export default FormColorInput;