'use client';

import ReadOnlyInput from "@/components/helper/ReadOnlyInput";
import {Switch} from "@mantine/core";
import {ComponentProps, useEffect, useState} from "react";
import FormComponent from "@/components/ui/base/FormComponent";

function FormSwitch({ name, defaultChecked, checked, ...props }: ComponentProps<typeof Switch>) {
    const [c, setC] = useState(defaultChecked ?? props.defaultValue ?? false);
    const event = (e: Event) => {
        e.stopPropagation();
        setC(prev => !prev)
    };

    return (
        <div>
            <FormComponent
                component={Switch}
                key={name}
                {...props}
                required={false}
                value={undefined}
                name={undefined}
                checked={typeof c === 'boolean' ? c : !!c}
                onChange={event as any}
            />
            <ReadOnlyInput name={name} value={c ? "true" : "false"} />
        </div>
    )
}

export default FormSwitch;