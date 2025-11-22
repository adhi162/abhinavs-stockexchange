import { MessageCircle, Send } from "lucide-react";

const buttons = [
  {
    label: "WhatsApp",
    href: "https://wa.me/9779841234567",
    icon: MessageCircle,
    bg: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    label: "Telegram",
    href: "https://t.me/senateexchange",
    icon: Send,
    bg: "bg-sky-500 hover:bg-sky-600",
  },
];

export const FloatingContacts = () => {
  return (
    <div className="fixed bottom-6 right-4 z-[60] flex flex-col items-end gap-3">
      {buttons.map((button) => (
        <a
          key={button.label}
          href={button.href}
          target="_blank"
          rel="noreferrer"
          className={`group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-slate-700/20 transition hover:-translate-y-0.5 ${button.bg}`}
          aria-label={`Open ${button.label}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <button.icon className="h-4 w-4" />
          </span>
          <span>{button.label}</span>
        </a>
      ))}
    </div>
  );
};

