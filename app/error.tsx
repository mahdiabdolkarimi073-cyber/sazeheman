'use client';
import React from 'react';
import MainLayout from "@/app/(main)/layout";
import PageHeaderGrid from "@/components/ui/stuff/PageHeaderGrid";
import Error from "@/components/ui/theme/Error";
import Link from "next/link";
import {Button} from "@mantine/core";

function ErrorPage(props: {
    error?: {message?: string, cause?: string} | string,
    reset?: any,
    code?: number,
    noGrid?: boolean
}) {
    const err = props.error ?? props.reset;
    return (
        <MainLayout withoutFooter>
            {!props.noGrid && (
                <PageHeaderGrid/>
            )}
            <Error code={Number(props?.code) || 500} message={typeof props.error === 'string' ? props.error:err?.message ?? err?.cause ?? "خطای ناشناخته!"} btn={(
                <div className={'flex gap-2 items-center'}>
                    <Button radius={'xl'} onClick={()=>{
                        window.location.reload();
                    }}>
                        تلاش مجدد
                    </Button>
                    <Link href={'/'}>
                        <Button radius={'xl'} color={'gray'}>
                            صفحه اصلی
                        </Button>
                    </Link>
                </div>
            )}/>
        </MainLayout>
    );
}

export default ErrorPage;