import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Phone } from "lucide-react";

export const CTASection = () => {
  return (
    <section
      id="contacts"
      data-animate="fade-up"
      data-animate-section="contacts"
      className="py-24"
    >
      <div
        data-animate="fade-up"
        className="mx-auto max-w-5xl rounded-[40px] border border-white/70 bg-gradient-to-br from-white/95 via-emerald-50/50 to-white/90 px-8 py-16 text-center shadow-2xl shadow-emerald-100 backdrop-blur"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
          Ready when you are
        </p>
        <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
          Start your exchange in one message
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          Send the amount, currency, and preferred route. We’ll confirm the guaranteed rate and ETA immediately.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="h-14 rounded-full px-8 text-base font-semibold">
            <a
              href="https://wa.me/9779841234567"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp desk
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-14 rounded-full border border-slate-200 bg-white px-8 text-base font-semibold text-slate-700"
          >
            <a href="https://t.me/senateexchange" target="_blank" rel="noreferrer">
              <Send className="h-5 w-5" />
              Telegram desk
            </a>
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Phone className="h-4 w-4 text-emerald-500" />
          Or call us:
          <a href="tel:+9779841234567" className="font-semibold text-slate-900">
            +977 9841 234 567
          </a>
        </div>

        <div className="mt-12 grid gap-6 text-sm text-slate-500 sm:grid-cols-3">
          {[
            { title: "Licensed", subtitle: "NRB Licensed" },
            { title: "5★ rated", subtitle: "Google & Yandex" },
            { title: "24/7 desk", subtitle: "Urgent support anytime" }
          ].map((item, index) => (
            <div
              key={item.title}
              data-animate="fade-up"
              data-animate-delay={String(80 * index)}
              className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm"
            >
              <p className="text-lg font-semibold text-slate-900">{item.title}</p>
              <p>{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
