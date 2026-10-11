'use client';

import {
    createTheme,
    LoadingOverlay,
    Modal,
    NumberInput,
    PasswordInput,
    ScrollArea,
    Select,
    Slider,
    Switch,
    TextInput,
    Tooltip
} from "@mantine/core";
import {InvalidEvent} from "react";

const inputProps: any = {
    inputWrapperOrder: ['label', 'error', 'input', 'description'],
};

const mantineTheme = createTheme({
    primaryColor: "primary",
    colors: {
        primary: Array.from({length: 10}).map(() => "var(--primary)") as any,
        secondary: Array.from({length: 10}).map(() => "var(--secondary)") as any,
        dark: [
            "#f5f5f5",
            "#e7e7e7",
            "#cdcdcd",
            "#b2b2b2",
            "var(--input-bg)",
            "var(--input-bg)",
            "var(--input-bg)",
            "var(--background)",
            "var(--background)",
            "var(--background)"
        ]
    },
    black: "var(--text)",
    fontFamily: "var(--font-family)",
    defaultRadius: "12px",
    components: {
        Slider: Slider.extend({
            classNames: {
                thumb: "bg-primary border-green-800!  border-5!",
            },
            defaultProps: {
                size: "md"
            }
        }),
        Modal: Modal.extend({
            defaultProps: {
                radius: "24px",
                scrollAreaComponent: ScrollArea.Autosize,
                centered: true,
                classNames: {
                    overlay: "bg-dark/20! backdrop-blur-xs!",
                    content: "p-1",
                    title: "text-xl! font-medium!",
                    header: "pb-1!",
                },
                transitionProps: {transition: 'fade'}
            }
        }),
        Switch: Switch.extend({
            defaultProps: {
                withThumbIndicator: false
            },
            styles: {
                track: {
                    transform: "scaleX(-1)"
                }
            },
            classNames: {
                root: "cursor-pointer!",
                
            }
        }),
        TextInput: TextInput.extend({
            defaultProps: inputProps
        }),
        PasswordInput: PasswordInput.extend({
            defaultProps: inputProps
        }),
        Select: Select.extend({
            defaultProps: inputProps
        }),
        NumberInput: NumberInput.extend({
            defaultProps: inputProps
        }),
        Textarea: {
            defaultProps: inputProps
        },
        LoadingOverlay: LoadingOverlay.extend({
            classNames: {
                overlay: "bg-white/7! backdrop-blur!"
            }
        })
    }
});

export default mantineTheme
