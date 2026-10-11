'use client'


import {usePathname} from "next/navigation";
import {ComponentProps, Fragment, useEffect} from "react";
import {twMerge} from "tailwind-merge";


type Style = {
    [key: string]: ComponentProps<'div'>['style'] | Style
} | ComponentProps<'div'>['style']



function StyledDiv(props: {
    style?: Style,
    base: string,
    important?: boolean
} & Omit<ComponentProps<"div">, 'style'>) {
    usePathname();
    const id = "styled-div-" + props.base;
    const className = props.base;
    const finalBase = props.base ? className : (!!props.base ? ".":"") + className;

    useEffect(() => {
        return () => {
            try {
                const node = document.querySelector(`style[data-ssr="${id}"]`);
                const childs = Array.from(node?.childNodes || []);
                if (childs.find(o => o === node)) node?.parentNode?.removeChild(node);
            } catch {}
        }
    })
    
    return (
        <>
            <style key={id} data-ssr={id}>{styleToString(finalBase, props.important, props.style || {})}</style>
            <div {...props} style={undefined} className={twMerge(className.startsWith(".") ? className.substring(1) : className, props?.className)} />
        </>
    );
}

const toKebabCase = (str: string) => {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};


function styleToString(baseName: string, important: boolean = false, style: Style = undefined) {
    const list = Object.entries(style as any);
    let body = ``;
    let after = "";

    for (const [key, value] of list) {
        if (typeof value === 'object') {
            const kStr = `${key}`;
            after += styleToString(kStr.startsWith(":") ? `${baseName}${kStr}` : baseName + " " + kStr, important, value as any) + "\n";
        } else {
            body += `${toKebabCase(key)}: ${value || (typeof value === 'string' ? "''" : "") || value} ${important ? "!important" : ""};`
        }
    }

    return `${baseName} { ${body} }\n${after}`;
}

export default StyledDiv;