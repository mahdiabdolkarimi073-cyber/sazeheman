import ConstructionHero from "@/components/ui/home/ConstructionHero";
import MainMap from "@/components/ui/home/MainMap";
import ConstructionCategories from "@/components/ui/home/ConstructionCategories";
import HowItWorks from "@/components/ui/home/HowItWorks";
import TendersSection from "@/components/ui/home/TendersSection";
import FeaturedProfessionals from "@/components/ui/home/FeaturedProfessionals";
import TrustBenefits from "@/components/ui/home/TrustBenefits";
import Comments from "@/components/ui/home/comments/Comments";
import FAQ from "@/components/ui/home/FAQ";
import FeedbackSection from "@/components/ui/home/FeedbackSection";
import { getAllPlans } from "@/app/(landing)/dashboard/subscription/PlanEnums";
import CacheUpdate from "@/lib/utils/cache-ssr";
import PlanList from "@/components/ui/home/PlanList";
import { Metadata } from "next";
import Script from "next/script";
import { MainPageSchemaGraphSnippet } from "@/lib/utils/seo";


export default async function Home() {
    const [plans] = await Promise.all([
        getAllPlans()
    ]);

    return (
        <main>
            <ConstructionHero />
            <div id="categories"><ConstructionCategories /></div>
            <div id="map">
                <MainMap />
            </div>
            <HowItWorks />
            <div id="tenders">
                <TendersSection />
            </div>
            <FeaturedProfessionals />
            <TrustBenefits />
            <div id="plans">
                <CacheUpdate cache={{ plans }}>
                    <PlanList />
                </CacheUpdate>
            </div>
            <Comments />
            <div id="faq">
                <FAQ />
            </div>
            <FeedbackSection />
            <style dangerouslySetInnerHTML={{ __html: `:root {--footer-bg: 180%}` }} />
            <Script
                id="ld-mainpage-graph"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(MainPageSchemaGraphSnippet()) }}
            />
        </main>
    );
}

export const metadata: Metadata = {
    title: "سازه‌همان — پلتفرم جامع صنعت ساختمان"
}
