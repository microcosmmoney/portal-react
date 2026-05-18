// AI-generated · AI-managed · AI-maintained
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "../../i18n/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

const locales = [
  { code: "en", label: "English" },
  { code: "zh", label: "\u4e2d\u6587" },
  { code: "ko", label: "\ud55c\uad6d\uc5b4" },
  { code: "ja", label: "\u65e5\u672c\u8a9e" },
] as const;

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLabel = locales.find((l) => l.code === locale)?.code.toUpperCase() ?? "EN";

  function onSelectLocale(newLocale: string) {
    // Cookie \u6301\u4e45\u5316\u8bed\u8a00\u9009\u62e9，\u8de8\u9875\u9762/\u767b\u5f55\u540e\u4fdd\u6301
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
    router.replace(pathname, { locale: newLocale as "en" | "zh" | "ko" | "ja" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-neutral-400 hover:text-white rounded transition-colors hover:bg-white/5 outline-none"
          aria-label="Switch language"
        >
          <Globe size={16} />
          <span className="text-xs font-medium">{currentLabel}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] bg-neutral-900/95 backdrop-blur-xl border-neutral-700 shadow-xl"
      >
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => onSelectLocale(l.code)}
            className={`cursor-pointer text-sm ${
              locale === l.code
                ? "text-violet-400 font-medium"
                : "text-neutral-300 hover:text-white"
            }`}
          >
            <span className="w-7 text-xs text-neutral-500 uppercase">{l.code}</span>
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
