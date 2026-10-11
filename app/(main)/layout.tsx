import React from 'react';
import Navbar from "@/components/ui/theme/Navbar";
import Footer from "@/components/ui/theme/Footer";


function MainLayout(props: { withoutFooter?: boolean } & Record<string, any>) {
    return (
        <div className="min-h-screen flex flex-col items-stretch justify-between content-stretch">
            <Navbar/>
            {props.children}
            {!props.withoutFooter && (
                <Footer/>
            )}
        </div>
    );
}

export default MainLayout;