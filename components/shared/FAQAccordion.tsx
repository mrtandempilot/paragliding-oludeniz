'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  title?: string
}

export default function FAQAccordion({ items = [], title = 'Frequently Asked Questions' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {title && (
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>
      )}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-xl overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-slate-900 pr-4">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
