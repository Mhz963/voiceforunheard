import { useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import SpeakAloud from '../voice/SpeakAloud'

export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div
          key={item.question}
          className={`accordion__item ${openIndex === index ? 'accordion__item--open' : ''}`}
          style={{ '--item-index': index }}
        >
          <div className="accordion__header">
            <button
              type="button"
              id={`faq-q-${index}`}
              className="accordion__trigger"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-a-${index}`}
            >
              <span className="accordion__question">{item.question}</span>
              <HiChevronDown className="accordion__icon" aria-hidden="true" />
            </button>
            <SpeakAloud text={[item.question, item.answer].join('. ')} className="accordion__speak" />
          </div>
          <div className="accordion__panel" id={`faq-a-${index}`} role="region" aria-labelledby={`faq-q-${index}`}>
            <div className="accordion__panel-inner">
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
