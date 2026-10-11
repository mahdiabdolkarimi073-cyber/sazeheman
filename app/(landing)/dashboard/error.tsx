'use client';

import {Button} from "@mantine/core";
import Link from "next/link";
import Error from "@/components/ui/theme/Error";

function Err(props: any) {
    const err = props?.error;
    return (
        <Error
            code={500}
            message={err?.message ?? err.cause ?? "خطای ناشناخته!"}
            btn={(
                <div className={'flex gap-2 items-center'}>
                    <Button radius={'xl'} onClick={() => {
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
            )}
        />
    );
}

export default Err;