import { IconGift, IconStarGroup } from "@/components/ui/SVGs";
import React from "react";

const DashIcons = {
    dashboard: (
        <svg
            width={17}
            height={17}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                clipRule="evenodd"
                d="M.625 3.542C.625 1.354.648.625 3.542.625c2.893 0 2.916.729 2.916 2.917 0 2.187.01 2.916-2.916 2.916C.616 6.458.625 5.73.625 3.542zM9.791 3.542c0-2.188.024-2.917 2.917-2.917s2.917.729 2.917 2.917c0 2.187.01 2.916-2.917 2.916-2.926 0-2.917-.729-2.917-2.916zM.625 12.708c0-2.188.023-2.917 2.917-2.917 2.893 0 2.916.73 2.916 2.917 0 2.188.01 2.917-2.916 2.917-2.926 0-2.917-.73-2.917-2.917zM9.791 12.708c0-2.188.024-2.917 2.917-2.917s2.917.73 2.917 2.917c0 2.188.01 2.917-2.917 2.917-2.926 0-2.917-.73-2.917-2.917z"
                stroke="currentColor"
                strokeWidth={1.25}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    income: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M14.6697 7.65137H5.33091C3.75133 7.65137 2.76855 8.76633 2.76855 10.3435V14.8082C2.76855 16.3861 3.75133 17.5003 5.33173 17.5003H14.6697C16.2485 17.5003 17.2313 16.3861 17.2313 14.8082V10.3435C17.2313 8.76633 16.2445 7.65137 14.6697 7.65137Z"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.35156 9.86816H6.47867" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M14.6476 15.2848H13.5205" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd"
                d="M8.16064 12.5771C8.16064 11.562 8.98367 10.7389 9.99892 10.7389C11.0141 10.7389 11.8372 11.562 11.8372 12.5771C11.8372 13.5924 11.0141 14.4154 9.99892 14.4154C8.98367 14.4154 8.16064 13.5924 8.16064 12.5771Z"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.76416 5.28116V4.03809" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M13.2334 5.28116V4.03809" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M9.99854 5.2813V2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    ),
    settings: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                d="M17.3387 6.35293L16.82 5.45285C16.3812 4.69125 15.4087 4.42852 14.6461 4.86552C14.283 5.07937 13.8499 5.14005 13.4421 5.03416C13.0342 4.92827 12.6853 4.66452 12.4722 4.30106C12.3351 4.07004 12.2614 3.80691 12.2586 3.53829C12.271 3.1076 12.1085 2.69025 11.8081 2.38131C11.5078 2.07237 11.0952 1.89814 10.6644 1.89832H9.61938C9.19727 1.89832 8.79256 2.06651 8.4948 2.36571C8.19704 2.6649 8.03078 3.07041 8.0328 3.49252C8.02029 4.36402 7.3102 5.06393 6.4386 5.06384C6.16997 5.06105 5.90684 4.98737 5.67583 4.85026C4.91318 4.41326 3.94072 4.676 3.50191 5.4376L2.94509 6.35293C2.5068 7.11358 2.76596 8.08542 3.5248 8.52684C4.01805 8.81162 4.32191 9.33791 4.32191 9.90747C4.32191 10.477 4.01805 11.0033 3.5248 11.2881C2.76693 11.7265 2.50749 12.696 2.94509 13.4544L3.4714 14.3621C3.677 14.7331 4.02197 15.0068 4.42996 15.1228C4.83795 15.2387 5.27533 15.1873 5.64531 14.9799C6.00903 14.7677 6.44245 14.7096 6.84925 14.8184C7.25604 14.9273 7.60249 15.1941 7.8116 15.5596C7.94871 15.7907 8.02239 16.0538 8.02518 16.3224C8.02518 17.2029 8.73892 17.9166 9.61938 17.9166H10.6644C11.5419 17.9166 12.2544 17.2075 12.2586 16.33C12.2565 15.9066 12.4238 15.4999 12.7233 15.2005C13.0227 14.9011 13.4294 14.7338 13.8528 14.7358C14.1208 14.743 14.3828 14.8164 14.6156 14.9494C15.3762 15.3877 16.3481 15.1285 16.7895 14.3697L17.3387 13.4544C17.5513 13.0895 17.6096 12.6549 17.5008 12.2469C17.392 11.8389 17.125 11.491 16.759 11.2805C16.3929 11.0699 16.1259 10.7221 16.0171 10.314C15.9083 9.90601 15.9667 9.47143 16.1793 9.10655C16.3175 8.8652 16.5176 8.66508 16.759 8.52684C17.5133 8.08566 17.7718 7.1195 17.3387 6.36056V6.35293Z"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M10.1455 12.1043C11.3588 12.1043 12.3423 11.1207 12.3423 9.90749C12.3423 8.69423 11.3588 7.71069 10.1455 7.71069C8.93227 7.71069 7.94873 8.69423 7.94873 9.90749C7.94873 11.1207 8.93227 12.1043 10.1455 12.1043Z"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    support: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M9.9998 17.2969C13.9766 17.2969 17.1998 14.0729 17.1998 10.0969C17.1998 6.12005 13.9766 2.89685 9.9998 2.89685C6.023 2.89685 2.7998 6.12005 2.7998 10.0969C2.7998 14.0729 6.023 17.2969 9.9998 17.2969Z"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd"
                d="M13.3038 10.0961C13.3038 11.9201 11.8254 13.3985 10.0014 13.3985C8.17741 13.3985 6.69824 11.9201 6.69824 10.0961C6.69824 8.27211 8.17741 6.7937 10.0014 6.7937C11.8254 6.7937 13.3038 8.27211 13.3038 10.0961Z"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.66758 12.4282L4.90918 15.1866" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M12.3359 12.4313L15.0927 15.1881" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M4.90918 5.00623L7.6668 7.76382" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M12.3359 7.76223L15.0919 5.00623" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    ),
    wishlist: <IconGift />,
    giftcards: (

        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6.88664 16.9231H13.0778C14.5746 16.9231 15.7886 15.7091 15.7886 14.2122V5.78776C15.7886 4.29087 14.5746 3.0769 13.0778 3.0769H6.88664C5.389 3.0769 4.17578 4.29087 4.17578 5.78776V14.2122C4.17578 15.7091 5.389 16.9231 6.88664 16.9231Z"
                stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd"
                d="M8.02179 8.15205C7.79125 7.4328 8.06072 6.61026 8.81587 6.36702C9.21325 6.23978 9.6481 6.31238 9.98195 6.56311C10.3157 6.31463 10.7491 6.24203 11.1458 6.36702C11.9009 6.61026 12.1726 7.4328 11.9421 8.15205C11.5836 9.29195 9.98195 10.1706 9.98195 10.1706C9.98195 10.1706 8.39302 9.30541 8.02179 8.15205Z"
                stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.17529 12.7704H15.7881" stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    ),
    subscription: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16.7677 7.26479V12.7354C16.7677 13.4603 16.3809 14.13 15.7533 14.4925L11.0148 17.2282C10.3872 17.5906 9.61375 17.5906 8.98617 17.2282L4.24774 14.4925C3.62016 14.13 3.2334 13.4603 3.2334 12.7354V7.26479C3.2334 6.53911 3.62016 5.86937 4.24774 5.50694L8.98617 2.77122C9.61375 2.40959 10.3872 2.40959 11.0148 2.77122L15.7533 5.50694C16.3809 5.86937 16.7677 6.53911 16.7677 7.26479Z"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 7.46069V12.5397" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M7.82861 8.68176L12.1698 11.3193" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M12.1698 8.68176L7.82861 11.3193" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    ),
    donations: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8.90474 14.036H10.1129C10.9756 14.036 11.6721 13.4157 11.6721 12.553C11.6721 11.8362 11.1872 11.263 10.4923 11.0886C9.49666 10.8389 8.50424 10.6427 7.46554 10.6678C5.82039 10.7084 4.66903 11.6254 3.36523 12.4986"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M8.90542 14.0645C9.51592 13.9753 10.1378 14.0653 10.7557 14.0507C12.1867 14.0166 13.3082 12.8069 14.3971 11.9864C14.9541 11.5671 15.7333 11.6231 16.2255 12.1169C16.7712 12.6658 16.7712 13.5545 16.2255 14.1034C15.049 15.284 14.0095 16.3802 12.4146 16.9996C10.2019 17.8607 8.1489 17.4431 5.9078 16.9996C5.04103 16.8285 4.24237 16.818 3.36426 16.818"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M12.8798 4.3959C12.8053 3.94508 12.6001 3.51129 12.2514 3.16345C11.3668 2.27885 9.93335 2.27885 9.04868 3.16345C8.16411 4.04806 8.16411 5.4824 9.04868 6.367C9.59926 6.91755 10.3623 7.12431 11.0742 6.98971"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd"
                d="M15.5701 6.6209C15.5701 7.87199 14.5558 8.8855 13.3047 8.8855C12.0544 8.8855 11.04 7.87199 11.04 6.6209C11.04 5.3698 12.0544 4.35547 13.3047 4.35547C14.5558 4.35547 15.5701 5.3698 15.5701 6.6209Z"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    tools: <IconStarGroup />,
    orders: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.96911 4.43607L3.31796 6.06393C3.08969 6.63499 2.97143 7.24497 2.97069 7.85943L2.96096 13.7796C2.95647 15.6043 3.78499 16.8953 5.61193 16.8999L14.1569 16.9118C15.9831 16.9163 16.7921 15.6305 16.7966 13.8058L16.8071 7.87515C16.8079 7.2502 16.6881 6.6305 16.4545 6.0512L15.8019 4.43083C15.4756 3.61953 14.6882 3.08813 13.8133 3.08813H5.95921C5.08279 3.08813 4.29393 3.62177 3.96911 4.43607Z"
                stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.11768 13.4445H8.42212M6.11768 11.2612H7.03826" stroke="currentColor" strokeWidth="1.15385"
                strokeLinecap="round" strokeLinejoin="round" />
            <path fillRule="evenodd" clipRule="evenodd"
                d="M12.0468 12.2846H13.6327C13.9718 12.2846 14.2473 12.0099 14.2473 11.6702V10.0842C14.2473 9.74515 13.9718 9.47046 13.6327 9.47046H12.0468C11.7078 9.47046 11.4331 9.74515 11.4331 10.0842V11.6702C11.4331 12.0099 11.7078 12.2846 12.0468 12.2846Z"
                stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.88428 6.92838V3.08813" stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round"
                strokeLinejoin="round" />
            <path d="M3.06641 6.92834H16.7015" stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    ),
    products: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.8056 12.7156V13.9288C16.8056 15.5821 15.4651 16.9225 13.811 16.9225H12.8193"
                stroke="currentColor"
                strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.96143 12.7156V13.9288C2.96143 15.5821 4.30188 16.9225 5.95593 16.9225H6.92292"
                stroke="currentColor"
                strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.96143 7.28437V6.07115C2.96143 4.41785 4.30188 3.07739 5.95593 3.07739H6.94762"
                stroke="currentColor"
                strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.8072 7.28437V6.07115C16.8072 4.41785 15.4668 3.07739 13.8127 3.07739H12.8457"
                stroke="currentColor"
                strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M13.2057 8.644V11.3512C13.2057 11.7007 13.0194 12.024 12.7162 12.1984L10.3722 13.5523C10.069 13.7267 9.69631 13.7267 9.39316 13.5523L7.04905 12.1984C6.74593 12.024 6.55957 11.7007 6.55957 11.3512V8.644C6.55957 8.29452 6.74593 7.97119 7.04905 7.79606L9.39316 6.44287C9.69631 6.26774 10.069 6.26774 10.3722 6.44287L12.7162 7.79606C13.0194 7.97119 13.2057 8.29452 13.2057 8.644Z"
                stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.69775 8.14307L9.88165 9.98496L13.0655 8.14307" stroke="currentColor" strokeWidth="1.15385"
                strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.88428 13.6882V9.98267" stroke="currentColor" strokeWidth="1.15385" strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    ),
    auctions: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                d="M10.678 3.087a.625.625 0 0 0-.884 0l-6.25 6.25a.625.625 0 0 0 0 .884l6.25 6.25a.625.625 0 0 0 .884 0l6.25-6.25a.625.625 0 0 0 0-.884l-6.25-6.25Z"
                stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.875 9.792 8.75 14.667M5.625 8.042 14.375 16.792" stroke="currentColor" strokeWidth="1.25"
                strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14.5 14.5 17 17" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"
                strokeLinejoin="round" />
        </svg>
    )
} as const;

export type DashIconName = keyof typeof DashIcons;

interface DashIconProps {
    name: DashIconName;
    className?: string;
}

export const DashIcon: React.FC<DashIconProps> = ({ name, className }) => {
    const IconComponent = DashIcons[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in DashIcons`);
        return null;
    }

    return (
        <span className={className}>
            {IconComponent}
        </span>
    );
};

export default DashIcons;