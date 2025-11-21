import { useEffect, useState } from "react";
import { MessageCircle, Calculator, Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: MessageCircle,
    title: "Say hello",
    description: "Send the amount and currency via WhatsApp or Telegram. No forms, no friction."
  },
  {
    icon: Calculator,
    title: "Get a live quote",
    description: "We send you a binding rate, fees, and delivery ETA within minutes."
  },
  {
    icon: Truck,
    title: "Pick the route",
    description: "Choose ATM withdrawal, cash courier, office pickup, or bank transfer."
  },
  {
    icon: CheckCircle,
    title: "Settle in hours",
    description: "Sign off on the rate and complete the exchange in as little as 30 minutes."
  }
];

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const lineProgress = ((activeStep + 1) / steps.length) * 100;

  return (
    <section id="process" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Concierge settlement in four steps
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-slate-100 lg:block" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto hidden h-1 w-4/5 rounded-full bg-slate-100 lg:block" />
          <div
            className="absolute bottom-0 left-0 right-0 mx-auto hidden h-1 w-4/5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 lg:block"
            style={{ width: `${lineProgress}%` }}
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={cn(
                  "relative rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-200/50 backdrop-blur transition-all duration-500",
                  activeStep === index ? "ring-2 ring-emerald-200" : "opacity-80"
                )}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="absolute left-6 top-6 text-sm font-semibold text-slate-300">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div
                  className={cn(
                    "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition duration-500",
                    activeStep === index && "scale-110 bg-emerald-500/10 text-emerald-700"
                  )}
                >
                  <step.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
                <div
                  className={cn(
                    "absolute inset-x-4 bottom-4 h-1 rounded-full bg-emerald-100 transition-all duration-500",
                    activeStep === index ? "scale-x-100 opacity-100" : "scale-x-75 opacity-0"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
