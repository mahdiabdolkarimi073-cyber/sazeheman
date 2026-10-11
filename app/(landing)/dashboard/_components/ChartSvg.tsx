import React, {ComponentProps} from 'react';

const ChartSvg = ({
    data = [41, 1, 21, 35, 1, 21, 1, 21, 1],
    width = 120,
    height = 42,
    strokeWidth = 2,
    color = 'var(--primary)',
    style = {} as ComponentProps<'svg'>['style']
}) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    const points = data.map((value, index) => {
        const x = (width / (data.length - 1)) * index;
        const y = height - ((value - minValue) / range) * (height - strokeWidth * 2) - strokeWidth;
        return { x, y };
    });

    let path = `M${points[0]?.x || 0} ${points[0]?.y || 0}`;
    for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const controlPointX = (current.x + next.x) / 2;
        path += ` C${controlPointX} ${current.y}, ${controlPointX} ${next.y}, ${next.x} ${next.y}`;
    }

    const pathLength = points.length * width;
    const gradientId = `g_${Math.random().toString(36).substr(2, 9)}`;


    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={style}>
            <defs>
                <linearGradient id={gradientId} x1="0%" x2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id={`m_${gradientId}`}>
                    <rect width={width} height={height} fill={`url(#${gradientId})`} />
                </mask>
            </defs>
            <path
                d={path}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                mask={`url(#m_${gradientId})`}
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength}
                style={{ animation: 'draw 3s forwards' }}
            />
            <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
        </svg>
    );
};

export default ChartSvg;