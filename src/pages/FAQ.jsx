import SectionHeader from '../components/ui/SectionHeader'
import Accordion from '../components/ui/Accordion'
import Reveal from '../components/ui/Reveal'
import { faqItems } from '../data/content'
import './FAQ.css'

export default function FAQ() {
  return (
    <div className="page faq-page">
      <section className="page-hero page-hero--faq">
        <div className="container">
          <SectionHeader
            badge="Questions Answered"
            title="Frequently Asked Questions"
            subtitle="Everything families and educators need to know about VoiceForUnheard and speech education for hearing impaired learners."
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <Reveal>
            <Accordion items={faqItems} />
          </Reveal>
        </div>
      </section>
    </div>
  )
}
