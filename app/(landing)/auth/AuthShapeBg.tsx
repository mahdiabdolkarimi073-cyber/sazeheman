import StyledDiv from "@/components/helper/StyledDiv";
import {ComponentProps} from "react";

const AuthShapeBg = (props: ComponentProps<'svg'>) => (
    <svg
        width={582}
        height={724}
        viewBox="0 0 582 724"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M-447 724C-47.1496 724 277 399.85 277 0C277 399.85 601.149 724 1001 724"
            fill="url(#paint0_linear_562_1945)"
        />
        <defs>
            <linearGradient
                id="paint0_linear_562_1945"
                x1="276.278"
                y1="709.853"
                x2="276.278"
                y2="-288.64"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="var(--background)" />
                <stop offset={1} stopColor="var(--primary)" />
            </linearGradient>
        </defs>
    </svg>
)

export const AuthShapeLineBg = (props: ComponentProps<'svg'>) => (
    <svg
        width={582}
        height={713}
        viewBox="0 0 582 713"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M812.444 1.58585V711.439H679.871V1.58585H812.444ZM624.492 1.58585V711.439H491.919V1.58585H624.492ZM436.541 1.58585V711.439H303.968V1.58585H436.541ZM248.589 1.58585V711.439H116.016V1.58585H248.589ZM60.6378 1.58585V711.439H-71.9354V1.58585H60.6378ZM-127.314 1.58585V711.439H-259.888V1.58585H-127.314Z"
            fill="url(#paint0_radial_562_1944)"
            stroke="url(#paint1_radial_562_1944)"
            strokeWidth="1.67814"
        />
        <defs>
            <StyledDiv
                base="svg"
                style={{
                    "": {
                        "--c": "var(--primary)"
                    },
                    "ignore, html.dark svg": {
                        "--c": "transparent"
                    }
                } as any}
            />
            <radialGradient
                id="paint0_radial_562_1944"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(0 255.077 -396.143 -4.33733 276.278 379.168)"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="var(--c)" />
                <stop offset={1} stopColor="var(--background)" />
            </radialGradient>
            <radialGradient
                id="paint1_radial_562_1944"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(276.278 356.513) rotate(90) scale(355.766 537.005)"
            >
                <stop stopColor="var(--primary)" />
                <stop offset={1} stopColor="var(--background)" />
            </radialGradient>
        </defs>
    </svg>
)

export default AuthShapeBg