'use client';

import ReadOnlyInput from "@/components/helper/ReadOnlyInput";
import {Select} from "@mantine/core";
import {ComponentProps, useMemo, useState} from "react";

function FormSelect({ name, ...props }: ComponentProps<typeof Select>) {
    const [value, setC] = useState(props.defaultValue ?? props?.value);
    const cached = useMemo(() => (
        <Select
            key={name}
            {...props}
            value={undefined}
            name={undefined}
            onChange={setC}
        />
    ), [props, value])

    return (
        <div>
            {cached}
            <ReadOnlyInput name={name} value={value ?? undefined} />
        </div>
    )
}

export default FormSelect;