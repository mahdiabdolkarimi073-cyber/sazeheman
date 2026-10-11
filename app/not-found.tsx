import React from 'react';
import MainLayout from "@/app/(main)/layout";
import PageHeaderGrid from "@/components/ui/stuff/PageHeaderGrid";
import Error from "@/components/ui/theme/Error";
import Link from "next/link";
import {Button} from "@mantine/core";

function NotFound() {
    return (
        <MainLayout withoutFooter>
            <PageHeaderGrid />
            <Error code={404} btn={(
                <Link href={'/'}>
                    <Button radius={'xl'}>
                        صفحه اصلی
                    </Button>
                </Link>
            )} />
        </MainLayout>
    );
}

export default NotFound;