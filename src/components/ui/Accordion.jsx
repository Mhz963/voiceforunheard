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
          <button
            type="button"
            className="accordion__trigger"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            aria-expanded={openIndex === index}
          >
            <span className="accordion__trigger-inner">
              <span>{item.question}</span>
              <SpeakAloud text={[item.question, item.answer].join('. ')} />
            </span>
            <HiChevronDown className="accordion__icon" />
          </button>
          <div className="accordion__panel">
            <div className="accordion__panel-inner">
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
