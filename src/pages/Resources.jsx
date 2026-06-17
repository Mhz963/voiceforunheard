import { HiArrowRight } from 'react-icons/hi'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import { resources } from '../data/content'

export default function Resources() {
  return (
    <div className="page resources-page">
      <section className="page-hero page-hero--resources">
        <div className="container">
          <SectionHeader
            badge="Knowledge Hub"
            title="Resources for Families and Educators"
            subtitle="Trusted organizations, research databases, and practical tools to support your speech education journey."
            light
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          {resources.map((group) => (
            <div key={group.category} className="resource-group">
              <Reveal>
                <h2 className="resource-group__title">{group.category}</h2>
              </Reveal>
              <Reveal className="resource-grid stagger">
                {group.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    className="resource-card interactive-card card-shine"
                    target={item.url.startsWith('http') ? '_blank' : undefined}
                    rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <span className="resource-card__link">
                      {item.url === '#' ? 'Coming soon' : (
                        <>Visit resource <HiArrowRight /></>
                      )}
                    </span>
                  </a>
                ))}
              </Reveal>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
