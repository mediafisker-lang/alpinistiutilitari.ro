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
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-emerald-400 bg-emerald-500 px-4 py-3 text-white shadow-xl shadow-emerald-900/20 transition hover:scale-[1.02] hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-white/15">
        <MessageCircleMore className="size-5" />
      </span>
      <span className="hidden text-sm font-semibold sm:inline">WhatsApp 0799 102 030</span>
    </Link>
  );
}
