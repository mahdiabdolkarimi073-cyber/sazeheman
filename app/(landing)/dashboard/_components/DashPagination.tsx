'use client';
import StyledDiv from "@/components/helper/StyledDiv";
import useDevice from "@/lib/hooks/useDevice";
import {Pagination} from "@mantine/core";
import {ComponentProps} from "react";
import useTheme from "@/lib/hooks/useTheme";

function DashPagination(props: ComponentProps<typeof Pagination>) {
    const device = useDevice();
    const [theme] = useTheme();

    return (
        <StyledDiv base='.pagination' style={theme === 'dark' ? {}:{
            "button[data-active=\"true\"]": {
                background: "#0001",
                border: "none",
                color: "black"
            }
        }}>
            <Pagination
                siblings={1}
                hideWithOnePage
                boundaries={device === 'desktop' ? 2:0}
                size={device === 'desktop' ? undefined:"sm"}
                withEdges={device === 'desktop'}
                radius={'xl'}
                classNames={{
                    control: device === "desktop" ? undefined:"text-xs!"
                }}
                {...props}
            />
        </StyledDiv>
    )
}

export default DashPagination;