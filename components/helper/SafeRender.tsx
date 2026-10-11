'use client';

import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ReactNode } from "react";
import CustomButton from "../ui/base/CustomButton";
import { IconDanger, IconError, IconErrorSingle, IconMessageAlert } from "../ui/SVGs";
import { Tooltip } from "@mantine/core";

function SafeRender(props: { children: ReactNode }) {
    return (
        <ErrorBoundary
            {...props}
            errorComponent={(props) => {
                console.error(props.error);
                return (
                    <Tooltip label={props?.error?.message ?? props?.error} >
                        <div className='flex items-center justify-center'>
                            <IconDanger />
                        </div>
                    </Tooltip>
                );
            }}
        />
    )
}

export default SafeRender;