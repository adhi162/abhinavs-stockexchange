import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Alexander K.",
      rating: 5,
      text: "Excellent service! Changed large amount for property purchase. Everything was fast, secure, and at a great rate. Highly recommend!",
      date: "2 weeks ago"
    },
    {
      name: "Marina P.",
      rating: 5,
      text: "Used their services multiple times. Always professional, best rates in Phuket, and very convenient delivery. Thank you!",
      date: "1 month ago"
    },
    {
      name: "Dmitry S.",
      rating: 5,
      text: "Helped with FET certificate for real estate. Everything was done quickly and professionally. No issues at all.",
      date: "3 weeks ago"
    },
    {
      name: "Elena V.",
      rating: 5,
      text: "Very convenient to exchange money through WhatsApp. Fast response, clear instructions, delivered to hotel. Perfect!",
      date: "1 week ago"
    },
    {
      name: "Sergey M.",
      rating: 5,
      text: "Been using Senate Exchange for over a year. Always reliable, transparent, and fair rates. The best in Thailand!",
      date: "2 months ago"
    },
    {
      name: "Olga T.",
      rating: 5,
      text: "Needed to exchange urgently - they helped within an hour! Professional team, great service. Will definitely use again.",
      date: "4 days ago"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="font-semibold text-foreground">Google</div>
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="font-semibold text-foreground">Yandex</div>
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                </div>
                <div className="flex text-primary">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{testimonial.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
