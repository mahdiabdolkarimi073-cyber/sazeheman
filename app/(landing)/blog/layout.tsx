import React from "react";
import Navbar from "@/components/ui/theme/Navbar";
import Footer from "@/components/ui/theme/Footer";

function Layout(props: any) {


    return (
        <div className='relative'>
            <div>
                <div className={'absolute left-0 top-0 w-full '}>
                    <Navbar fixed />
                </div>
                {props.children}
            </div>
            <Footer />
        </div>
    )
}

export default Layout;