import StyledDiv from "@/components/helper/StyledDiv";
import {ComponentProps} from "react";

export const CommentLineBgSvg = (props: ComponentProps<'svg'>) => (
    <svg
        width={640}
        height={424}
        viewBox="0 0 640 424"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <StyledDiv
            base="svg"
            style={{
                "": {
                    "--c":"#A4F4CF"
                },
                "ignore, html.dark svg": {
                    "--c": "transparent"
                }
            } as any}
        />
        <path
            d="M639.5 0.5V423.5H560.5V0.5H639.5ZM527.5 0.5V423.5H448.5V0.5H527.5ZM415.5 0.5V423.5H336.5V0.5H415.5ZM303.5 0.5V423.5H224.5V0.5H303.5ZM191.5 0.5V423.5H112.5V0.5H191.5ZM79.5 0.5V423.5H0.5V0.5H79.5Z"
            fill="url(#paint0_radial_472_121)"
            stroke="url(#paint1_radial_472_121)"
        />
        <defs>
            <radialGradient
                id="paint0_radial_472_121"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(0 152 -236.061 -2.58461 320 225.5)"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="var(--c)" />
                <stop offset={1} stopColor="var(--background)" />
            </radialGradient>
            <radialGradient
                id="paint1_radial_472_121"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(320 212) rotate(90) scale(212 320)"
            >
                <stop stopColor="#00D492" />
                <stop offset={1} stopColor="var(--background)" />
            </radialGradient>
        </defs>
    </svg>
)

export const CommentShapeBgSvg = (props: ComponentProps<'svg'>) => (
    <svg
        width={863}
        height={432}
        viewBox="0 0 863 432"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 431.43C238.27 431.43 431.43 238.27 431.43 0C431.43 238.27 624.59 431.43 862.86 431.43"
            fill="url(#paint0_linear_445_113)"
        />
        <defs>
            <linearGradient
                id="paint0_linear_445_113"
                x1={431}
                y1={423}
                x2={431}
                y2={-172}
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="var(--background)" />
                <stop offset={1} stopColor="var(--primary)" />
            </linearGradient>
        </defs>
    </svg>
)

export const CommentGradientShapeBgSvg = (props: ComponentProps<'svg'>) => (
    <svg
        width={1440}
        height={808}
        viewBox="0 0 1440 808"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g filter="url(#filter0_f_473_102)">
            <ellipse
                cx="889.5"
                cy={104}
                rx="889.5"
                ry={104}
                transform="matrix(1 0 0 -1 -170 508)"
                fill="url(#paint0_radial_473_102)"
            />
        </g>
        <defs>
            <filter
                id="filter0_f_473_102"
                x={-470}
                y={0}
                width={2379}
                height={808}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
            >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                />
                <feGaussianBlur
                    stdDeviation={150}
                    result="effect1_foregroundBlur_473_102"
                />
            </filter>
            <radialGradient
                id="paint0_radial_473_102"
                cx={0}
                cy={0}
                r={1}
                gradientTransform="matrix(1116.09 0 -861.747 636.604 278.05 125.285)"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="white" />
                <stop offset="0.3" stopColor="#BBF451" />
                <stop offset="0.7" stopColor="#00BC7D" />
                <stop offset={1} stopColor="white" />
            </radialGradient>
        </defs>
    </svg>
)