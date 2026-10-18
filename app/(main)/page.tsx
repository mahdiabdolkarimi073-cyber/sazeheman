import ConstructionHero from "@/components/ui/home/ConstructionHero";
import MainMap from "@/components/ui/home/MainMap";
import ConstructionCategories from "@/components/ui/home/ConstructionCategories";
import HowItWorks from "@/components/ui/home/HowItWorks";
import TendersSection from "@/components/ui/home/TendersSection";
import FeaturedProfessionals from "@/components/ui/home/FeaturedProfessionals";
import FAQ from "@/components/ui/home/FAQ";
import FeedbackSection from "@/components/ui/home/FeedbackSection";
import { getAllPlans } from "@/app/(landing)/dashboard/subscription/PlanEnums";
import CacheUpdate from "@/lib/utils/cache-ssr";
import PlanList from "@/components/ui/home/PlanList";
import { Metadata } from "next";
import Script from "next/script";
import { MainPageSchemaGraphSnippet } from "@/lib/utils/seo";
import { prisma } from "@/lib/prisma";


export default async function Home() {
    const [plans, auctionsRaw] = await Promise.all([
        getAllPlans(),
        prisma.auction.findMany({
            where: { status: "open" },
            include: { _count: { select: { bids: true } } },
            orderBy: { created_at: "desc" },
            take: 6,
        }).catch(() => []),
    ]);

    const auctions = auctionsRaw.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        city: a.city,
        budget: a.budget,
        deadline: a.deadline ? a.deadline.toISOString() : null,
        bidsCount: a._count.bids,
        status: a.status,
    }));

    return (
        <main>
            <ConstructionHero />
            <div id="categories"><ConstructionCategories /></div>
            <div id="map">
                <MainMap />
            </div>
            <FeaturedProfessionals />
            <div id="tenders">
                <TendersSection auctions={auctions} />
            </div>
            <HowItWorks />
            <div id="plans">
                <CacheUpdate cache={{ plans }}>
                    <PlanList />
                </CacheUpdate>
            </div>
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
