import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "What documents do I need for currency exchange?",
      answer: "For exchanges up to 50,000 THB, you only need your passport. For larger amounts, we may require additional documentation to comply with Thai financial regulations."
    },
    {
      question: "How long does the exchange process take?",
      answer: "Most exchanges are completed within 30-60 minutes. For cash delivery, it typically takes 1-3 hours depending on your location. Bank transfers are usually instant."
    },
    {
      question: "Do you have the best rates in Thailand?",
      answer: "Yes! We guarantee the best rates. If you find a better rate elsewhere, we'll match it and give you an even better deal. This is our commitment to all clients."
    },
    {
      question: "Is it safe to exchange large amounts?",
      answer: "Absolutely. We are fully licensed (License MC125660019) and operate under Thai financial regulations. All transactions are secure and documented."
    },
    {
      question: "What is FET and do I need it?",
      answer: "FET (Foreign Exchange Transaction) is a certificate required when buying property in Thailand as a foreigner. It proves that funds came from abroad legally. We handle all FET documentation for you."
    },
    {
      question: "Do you accept MIR cards?",
      answer: "Yes! We accept MIR cards from all Russian banks, as well as Union Pay and other major payment methods."
    },
    {
      question: "Can I exchange crypto currencies?",
      answer: "Yes, we exchange USDT, BTC, and other major cryptocurrencies. Rates are competitive and the process is straightforward."
    },
    {
      question: "What are your working hours?",
      answer: "We work 7 days a week from 9:00 AM to 8:00 PM. For urgent exchanges outside these hours, please contact us via WhatsApp or Telegram."
    },
    {
      question: "Is there a minimum exchange amount?",
      answer: "There is no minimum amount. We handle exchanges from small tourist amounts to large property-related transactions."
    },
    {
      question: "How do I get the best rate?",
      answer: "Contact us via WhatsApp or Telegram with the amount you want to exchange. We'll give you our best rate immediately. For very large amounts, we can offer even better rates."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our currency exchange services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
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
