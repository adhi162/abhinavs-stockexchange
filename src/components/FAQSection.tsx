import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What documents do I need?",
    answer: "For exchanges up to 50,000 THB we only need your passport. Higher amounts or real-estate settlements require proof of funds so we can prepare FET paperwork."
  },
  {
    question: "How fast can you settle?",
    answer: "Cash deliveries and ATM pickups are typically done in 30–90 minutes. Bank transfers are instant once the rate is confirmed."
  },
  {
    question: "Is FET support included?",
    answer: "Yes. We prepare full Foreign Exchange Transaction certificates so you can register freehold property or condo titles in Thailand."
  },
  {
    question: "Do you accept MIR cards?",
    answer: "We accept MIR, UnionPay, Visa, Mastercard, as well as USDT or BTC for on/off ramping."
  },
  {
    question: "Is there a minimum or maximum amount?",
    answer: "No minimum. We regularly handle both tourist amounts and multi-million THB settlements."
  },
  {
    question: "How do I secure the best rate?",
    answer: "Send the amount and route in WhatsApp, we reply with a binding rate. High-volume clients get custom spreads automatically."
  }
];

export const FAQSection = () => {
  return (
    <section id="faq" data-animate="fade-up" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Everything you keep asking us
          </h2>
        </div>

        <div
          data-animate="fade-up"
          data-animate-delay="100"
          className="mt-12 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/50 backdrop-blur"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="rounded-2xl border border-slate-100 bg-white px-4"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-slate-900 hover:text-emerald-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
