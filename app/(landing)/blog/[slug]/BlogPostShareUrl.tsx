'use client';

import StyledDiv from "@/components/helper/StyledDiv";

function BlogPostShareUrl(props: any) {
    return (
        <StyledDiv {...props} base=".share-url" onClick={async ()=>{
            await window.navigator.share({
                url: window.location.href
            })
        }} style={{
            ...props.style || {},
            "> *": {
                cursor: "pointer"
            }
        }} />
    )
}

export default BlogPostShareUrl;