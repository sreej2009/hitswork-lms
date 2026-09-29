import { features } from '../data/home';
import { FeatureCard } from '../components/feature/FeatureCard';
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeader } from '../components/ui/SectionHeader';

export function WhyChoose() {
  return (
    <Section labelledBy="why-title" className="border-y border-line bg-canvas">
      <Reveal>
        <SectionHeader
          id="why-title"
          align="center"
          title="Why Choose Hitswork?"
          subtitle="We’re committed to your learning success with world-class content and tools."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {features.map((feature, index) => (
          <RevealItem key={feature.title} className="h-full">
            <FeatureCard feature={feature} index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
