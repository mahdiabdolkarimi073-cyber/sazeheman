import {Loader} from "@mantine/core";

function Page() {
    return (
        <div className={'w-full grow h-full flex items-center justify-center flex-col gap-3'}>
            <Loader
                type={'oval'}
                size={'lg'}
            />
            <p>درحال بارگذاری...</p>
        </div>
    )
}

export default Page;