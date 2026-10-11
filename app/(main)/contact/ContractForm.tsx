'use client';

import { api } from "@/lib/api/base";
import { optimizeForm } from "@/lib/utils/global";
import { LoadingOverlay } from "@mantine/core";
import { ComponentProps, useState } from "react";

export default function ContractForm(props: ComponentProps<'form'>) {
    const [loading, setLoading] = useState(false);
    return (
        <form {...props} onSubmit={e => {
            e.preventDefault();
            const json = optimizeForm(e).toJson();
            setLoading(true);
            api("/contact", json, "POST")
            .then(()=>{
                alert("درخواست شما باموفقیت ثبت شد")
            })
            .finally(() => {
                setLoading(false);
            })
        }}>
            <LoadingOverlay visible={loading} className='filter-blur-xl!' />
            {props.children}
        </form>
    )
}