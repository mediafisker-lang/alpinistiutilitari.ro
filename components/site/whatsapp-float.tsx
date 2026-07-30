import Link from "next/link";
import { MessageCircleMore } from "lucide-react";

const whatsappNumber = "40799102030";

export function WhatsAppFloat() {
  return (
    <Link
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Deschide conversația pe WhatsApp"
      className="whatsapp-float fixed bottom-3 right-3 z-50 flex min-h-10 items-center gap-1.5 rounded-full border border-emerald-400 bg-emerald-500 px-2.5 py-1.5 text-white shadow-lg shadow-emerald-900/20 transition hover:scale-[1.03] hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:bottom-5 sm:right-5 sm:min-h-11 sm:gap-2 sm:px-3 sm:py-2"
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-white/15 sm:size-8">
        <MessageCircleMore className="size-3.5 sm:size-4" />
      </span>
      <span className="text-[11px] font-bold sm:text-[13px]">Online now! WhatsApp</span>
    </Link>
  );
}
