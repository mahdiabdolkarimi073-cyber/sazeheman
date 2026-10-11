import {Metadata} from "next";

function Page(props: any) {
    return props.children;
}


export const metadata: Metadata = {
    alternates: {
        canonical: "https://donofa.com/terms/",
    },
    title: "قوانین و مقررات"
}

export default Page;