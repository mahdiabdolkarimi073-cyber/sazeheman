import React from 'react';
import "./pattern.css";
import {customStyle} from "@/components/ui/utils";

function BgPattern(props: {
    reverse?: boolean
    count?: number
    gap?: number
    width?: number
}) {
    const {count = 24, reverse,gap = 15} = props;
    return (
        <div className={`pattern ${reverse && "flex-row-reverse"} w-full text-primary`} style={customStyle({
            "--gap": gap+"px",
            "--width": `${(100 / count).toFixed(2)}%`
        })}>
            <div className={'start'} />
            {Array.from({length: count}).map((_,i) => (
                <div key={i} className={'item'}>

                </div>
            ))}
            <div className={'end'} />
        </div>
    );
}

export default BgPattern;