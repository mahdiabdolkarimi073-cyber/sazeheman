import { useEffect, useMemo, useRef } from 'react';
import { useDelayedEffect } from "@/lib/hooks/useEffect";
import { flushSync } from 'react-dom';

function ReadOnlyInput({ name = '' as string, value = '' as string }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const cached = useMemo(() => (
        <input
            key={name}
            ref={inputRef}
            name={name}
            type={'text'}
            hidden
            defaultValue={value}
        />
    ), []);

    const sync = (value: string) => {
        if (!inputRef.current) {
            console.log("INPUT NOT IMPLEMENTED");
            return;
        }

        const stringValue = String(value);
        const input = inputRef.current;

        // Set value using native setter
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        )?.set;

        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, stringValue);
        }

        // Get React's internal instance and trigger onChange
        const tracker = (input as any)._valueTracker;
        if (tracker) {
            tracker.setValue(''); // Force React to think value changed
        }

        // Dispatch input event - React's onChange actually listens to this
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    }

    useDelayedEffect(() => {
        sync(value);
    }, [value, cached], 25);

    return cached;
}

export default ReadOnlyInput;