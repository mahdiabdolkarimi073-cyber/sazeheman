'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { Skeleton } from '@mantine/core';

interface SkeletonImageProps extends ImageProps {
    skeletonClassName?: string;
}

export default function SkeletonImage({
    skeletonClassName = '',
    ...imageProps
}: SkeletonImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="relative inline-block">
            {isLoading && (
                <Skeleton
                    radius={'0'}
                    classNames={{
                        root: `absolute! top-0 ${skeletonClassName}`
                    }}
                    style={{
                        width: imageProps.style?.width || imageProps.width,
                        height: imageProps.style?.height || imageProps.height,
                    }}
                />
            )}

            <Image
                {...imageProps}
                onLoad={() => setIsLoading(false)}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${imageProps.className || ''}`}
            />
        </div>
    );
}

// Usage Example:
// <SkeletonImage
//   src={e.url}
//   width={50}
//   height={50}
//   alt={e.months + ""}
//   style={{
//     objectFit: "cover",
//     width: "35px",
//     height: "35px"
//   }}
// />