'use client'

import {
  HeroSection,
  TrustedBySection,
  HowItWorksSection,
  FeaturesSection,
  FeatureSpotlightSection,
  StatsSection,
  TestimonialsSection,
  PlatformSection,
  FAQSection,
  CTASection,
  LandingNav,
  Footer,
} from '@/components/landing'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <LandingNav />

      <HeroSection />

      <TrustedBySection />

      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      <div id="features">
        <FeaturesSection />
      </div>

      <FeatureSpotlightSection />

      <StatsSection />

      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <PlatformSection />

      <div id="faq">
        <FAQSection />
      </div>

      <CTASection />

      <Footer />
    </div>
  )
}
