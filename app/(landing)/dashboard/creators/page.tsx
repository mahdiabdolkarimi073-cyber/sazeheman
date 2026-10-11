import React from 'react';
import DynamicForm from "@/app/(landing)/dashboard/workers/page";

function Page(props: any) {
    return (
        <DynamicForm formType={'contractorRegistrationForm'} />
    );
}

export default Page;