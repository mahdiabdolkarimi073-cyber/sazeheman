import React from 'react';
import Link from "next/link";
import {Button} from "@mantine/core";
import Error from "@/components/ui/theme/Error";

function Page() {
    return (
        <div className={'my-auto h-full flex flex-col justify-center items-center'}>
            <Error code={404} btn={(
                <Link href={'/dashboard'}>
                    <Button radius={'xl'}>
                        بازگشت
                    </Button>
                </Link>
            )}/>
        </div>
    );
}

export default Page;