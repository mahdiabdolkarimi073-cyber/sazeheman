import React from 'react';
import {SvgGridPattern} from "@/components/ui/SVGs";

function PageHeaderGrid(props: {
    scale?: number,
    stroke?: string
}) {
    return (
        <div className={'absolute left-0  top-0 right-0 mx-auto w-full max-w-fit h-50 -z-99 overflow-hidden lg:h-60'}>
            <SvgGridPattern stroke={props.stroke || "var(--primary)"} width={undefined} height={undefined} style={{
                width: '100%',
                height: '100%',
                transform: `scale(${props.scale || 2})`
            }} />
            <div className='absolute left-0 bottom-0 h-full w-full bg-linear-to-t from-background to-transparent' />
        </div>
    );
}

export default PageHeaderGrid;