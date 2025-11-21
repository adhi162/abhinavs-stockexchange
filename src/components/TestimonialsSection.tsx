import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alexander K.",
    rating: 5,
    text: "Changed a large amount for real estate. Everything was secure, documented, and the courier waited until the deed was signed.",
    date: "2 weeks ago"
  },
  {
    name: "Marina P.",
    rating: 5,
    text: "I always book rates over WhatsApp and pick up cash in the office. Transparent, polite and always on time.",
    date: "1 month ago"
  },
  {
    name: "Dmitry S.",
    rating: 5,
    text: "Needed FET certificates to register a condo. Senate prepared everything in 48 hours. Highly recommend.",
    date: "3 weeks ago"
  },
  {
    name: "Elena V.",
    rating: 5,
    text: "They delivered to my hotel at 10pm because I had an early signing. Exceptional service.",
    date: "1 week ago"
  },
  {
    name: "Sergey M.",
    rating: 5,
    text: "Been working with them for a year on corporate flows. Rates always beat my banks.",
    date: "2 months ago"
  },
  {
    name: "Olga T.",
    rating: 5,
    text: "Urgent weekend exchange solved within an hour. Communication is instant and professional.",
    date: "4 days ago"
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            Social proof
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            5-star desk trusted by expats & developers
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {["Google 5.0", "Yandex 5.0", "210+ verified reviews"].map((stat) => (
              <span key={stat} className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-slate-600 shadow-sm">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                {stat}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="flex h-full flex-col gap-4 border border-white/70 bg-white/85 p-6 shadow-lg shadow-slate-200/50 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.date}</p>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{testimonial.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
