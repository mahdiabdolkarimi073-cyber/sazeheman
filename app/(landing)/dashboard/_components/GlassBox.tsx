import React, {ReactNode} from 'react';
import "./GlassBox.css";
import {twMerge} from 'tailwind-merge';


function GlassBox({
                      color = 'var(--primary)',
                      deg = '180deg',
                      children = null as ReactNode,
                      className = '',
                      bg = "#00000005",
                      border = 1,
                      innerClassName = "",
                      withoutBorder = false,
                      fromPercent = "0%",
                      toPercent = "70%",
                      innerOpacity = '0.2',
                      fadeGradient = false,
                      radius = '16px',
                      fadeOpacity = "0.7",
                      borderColor = undefined as string | undefined,
                      innerBg = 'transparent',


                      borderFrom = color as string,
                      borderTo = bg as string,
                      innerFrom = color as string,
                      innerTo = bg as string
                  }) {
    if (withoutBorder) border = 0;
    return (
        <div
            className={twMerge(`glass-box-wrapper flex! flex-col items-stretch ${withoutBorder && "no-border"} ${fadeGradient && "fade"}`, className)}
            style={{
                '--box-color': color,
                '--deg': deg,
                "--border": border + "px",
                "--from-percent": fromPercent,
                "--to-percent": toPercent,
                "--inner-opacity": innerOpacity,
                "--radius": radius,
                "--fade-opacity": fadeOpacity,
                ...(borderColor && ({
                    "--border-color": borderColor,
                })),
                '--inner-bg': innerBg,
                "--border-from": borderFrom,
                "--border-to": borderTo,
                "--inner-from": innerFrom,
                "--inner-to": innerTo
            } as React.CSSProperties}
        >
            <div className={`glass-box-inner ${innerClassName}`}>
                <div className="circle-filter"/>
                {children}
            </div>
        </div>
    );
};

export default GlassBox;