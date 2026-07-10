import { AnalyzeSection } from '@/components/analyze-section';
import { FeaturesSection } from '@/components/features-section';
import { HeroSection } from '@/components/hero-section';
import { MethodSection } from '@/components/method-section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { StatsStrip } from '@/components/stats-strip';

export default function Home() {
    return (
        <div className='flex flex-1 flex-col bg-background font-sans'>
            <SiteHeader />
            <main className='flex-1'>
                <HeroSection />
                <StatsStrip />
                <MethodSection />
                <FeaturesSection />
                <AnalyzeSection />
            </main>
            <SiteFooter />
        </div>
    );
}
