'use client';

import {ComponentProps, JSXElementConstructor} from "react";
import FormComponent from "./FormComponent";

function FormInputFilter<T  extends JSXElementConstructor<any>>({component: Component, filter, ...props}: {
    component: T,
    filter: string
} & ComponentProps<T>) {
    return (
        <FormComponent
            component={Component}
            onBeforeInput={(e: any) => {
                const v = (e.data ?? e?.nativeEvent?.data)?.toLowerCase();
                if (filter.includes(v)) return;
                e.preventDefault();
                e.stopPropagation();
                return false;
            }}
            {...props}
        />
    )
}

export default FormInputFilter;