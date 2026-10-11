'use client';

import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTab } from "@mantine/core";
import StyledDiv from "@/components/helper/StyledDiv";
import { useTimeout, useWindowScroll } from "@mantine/hooks";
import { useDelayedEffect } from "@/lib/hooks/useEffect";
import { Throw } from "@/lib/utils/global";



function TabsTitleList(
    {
        tabs: defaultTabs = [] as { value: string, label: string }[],
        onChange: _onChange = undefined as ((o: string) => void) | undefined,
        defaultValue = "" as string,
        tag = "",
        offset = 0,
        ...others
    }
) {
    const [tabs, setTabs] = useState(defaultTabs);
    const [active, setActive] = useState<string | null>(defaultValue || tabs[0]?.value);
    const [wait, setWait] = useState(false);

    const elements = Array.from(document.querySelectorAll(tag || tabs.map(o => "#" + o.value).join(",")));

    const [{ y }, scrollTo] = useWindowScroll();
    const onChange = (e: string | undefined) => {
        if (!e) return;
        if (_onChange) return _onChange(e);

        let element = tag ? elements[+e] : document.querySelector("#" + e);
        if (!element) return;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        setWait(true);
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }

    useEffect(() => {
        if (wait) return;

        const NAVBAR_OFFSET = offset;

        let activeElement = elements[0];
        let smallestTop = Infinity;

        if (!activeElement) return;

        for (let i = 0; i < elements.length; i++) {
            const rect = elements[i].getBoundingClientRect();
            if (rect.top <= NAVBAR_OFFSET) {
                if (Math.abs(rect.top - NAVBAR_OFFSET) < smallestTop) {
                    smallestTop = Math.abs(rect.top - NAVBAR_OFFSET);
                    activeElement = elements[i];
                }
            }
        }

        const index = activeElement ? elements.findIndex(e => e === activeElement) : 0;
        setActive((tabs[index] || tabs[0])?.value);
    }, [y, elements, offset, wait]);
    useEffect(() => {
        setActive(defaultValue);
    }, [defaultValue]);
    useEffect(() => {
        if (!tag) return;
        setTabs(elements.map((o, i) => ({
            label: o.innerHTML,
            value: i + ""
        })))
    }, [elements])
    useEffect(()=>{
        if (!wait) return;
        const th = setTimeout(()=>{
            setWait(false);
        }, 800);
        return ()=>{
            clearTimeout(th);
        }
    }, [wait])

    return (
        <Tabs
            value={active}
            onChange={setActive}
            defaultValue="gallery" orientation="vertical"
            placement={'right'}
        >
            <StyledDiv base={'.styled-tabs'} style={{
                ".mantine-Tabs-list": {
                    ":before": {
                        borderWidth: "2px",
                        borderRadius: "100px",
                        overflow: 'hidden'
                    },
                    "button": {
                        borderRightWidth: "4px",
                        color: "rgb(from var(--text-color) r g b / 0.5)"
                    },
                    "button.active": {
                        color: "var(--primary)"
                    },
                    "button:hover": {
                        background: "unset"
                    },
                    gap: "10px",
                    ".mantine-Tabs-tabLabel": {
                        textAlign: "right",
                    }
                }
            }}>
                <TabsList>
                    {tabs.map(tab => (
                        <TabsTab
                            key={tab.value} value={tab.value}
                            className={`${tab.value === active ? "active" : ""} font-medium!`}
                            onClick={() => {
                                onChange(tab.value);
                            }}
                        >
                            {tab.label}
                        </TabsTab>
                    ))}
                </TabsList>
            </StyledDiv>
        </Tabs>
    )
}

export default TabsTitleList;