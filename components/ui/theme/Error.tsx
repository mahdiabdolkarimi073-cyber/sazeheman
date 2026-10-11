import React, {ReactNode} from 'react';
import Image from "next/image";

const texts = {
    404: 'صفحه مورد نظر شما یافت نشد!',
    500: "خطا!"
} as Record<number, string>;

function Error(props: {
    code: number,
    btn?: ReactNode,
    message?: string,
}) {
    return (
        <div className={'overflow-hidden grow w-full flex items-center justify-center'}>
            <div className={' container max-w-3xl mx-auto p-3'}>
                <div className={'w-full grid grid-cols-1 lg:grid-cols-2 gap-10'}>
                    <div className={'flex flex-col justify-center gap-3 max-w-[90%]'}>
                        <p className={'opacity-70'}>ارور {props.code.toLocaleString('fa')}</p>
                        <h3 className={'text-4xl font-medium'}>{texts[props.code] || texts[500]}</h3>
                        <p>
                            {props.message}
                        </p>
                        {props.btn}
                    </div>
                    <div className={'relative overflow-hidden lg:overflow-visible flex justify-center'}>
                        <div className={'absolute bottom-0 -left-full w-200 h-50 rounded-full overflow-hidden hidden lg:block'} style={{
                            background: "linear-gradient(90deg, transparent, var(--primary) 10%,rgb(from var(--secondary) r g b / 0.3) 50%, transparent 120%)",
                            backgroundPosition: "center",
                            filter: "blur(100px)",
                            width: "800px",
                            height: "270px"

                        }}>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Error;