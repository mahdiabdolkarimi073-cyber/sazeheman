'use client';

import {ComponentProps, ReactNode} from 'react';
import {DirectionProvider, MantineProvider} from "@mantine/core";
import {ModalsProvider} from "@mantine/modals";
import {Notifications} from '@mantine/notifications';
import GlobalContext from "@/context/GlobalContext";
import OverrideWindow from "@/components/helper/OverrideWindow";
import mantineTheme from "@/components/ui/mantine-theme";
import AudioPlayer from '@/components/helper/AudioPlayer';
import LinkLoader from "@/components/helper/LinkLoader";
import ThemeContext, { ThemeContextProvider } from "@/context/ThemeContext";
import ThemeDetector from '@/components/helper/ThemeDetector';


function LayoutProvider(props: {
    windowProps?: ComponentProps<typeof OverrideWindow>,
    children: ReactNode
}) {
    const theme = props.windowProps?.theme || "light";
    return (
        <DirectionProvider initialDirection={'rtl'}>
            <MantineProvider theme={mantineTheme} defaultColorScheme={theme} forceColorScheme={theme}>
                <Notifications position={props.windowProps?.os === "mobile" ? "bottom-right":'bottom-center'} />
                <AudioPlayer/>
                <LinkLoader/>
                
                <ModalsProvider labels={{
                    confirm: "تایید",
                    cancel: "لغو"
                }} modalProps={{
                    closeButtonProps: {
                        autoFocus: false,
                        className: "hidden"
                    }
                }}>
                    <GlobalContext value={{
                        ...(props.windowProps || {})
                    }}>
                        <OverrideWindow {...(props.windowProps || {}) as any} />
                        <ThemeContextProvider theme={theme}>
                            <ThemeDetector />
                            {props.children}
                        </ThemeContextProvider>
                    </GlobalContext>
                </ModalsProvider>
            </MantineProvider>
        </DirectionProvider>
    );
}

export default LayoutProvider;