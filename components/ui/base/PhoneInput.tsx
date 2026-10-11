import {NumberInput, NumberInputProps} from "@mantine/core";
import {IconPhone} from "@/components/ui/SVGs";
import FormComponent from "@/components/ui/base/FormComponent";
import React from "react";

function PhoneInput(props: NumberInputProps) {
    return (
        <FormComponent
            component={NumberInput}
            name={'phone'}
            size={'md'}
            ta={'left'}
            dir={'ltr'}
            classNames={{
                input: "text-left! pl-10! placeholder-right",
                label: "text-right!"
            }}
            placeholder={'...شماره تلفن'}
            rightSection={(
                <IconPhone/>
            )}
            {...props}
        />
    )
}

export default PhoneInput;