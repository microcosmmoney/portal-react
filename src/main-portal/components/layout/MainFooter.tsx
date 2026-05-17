// AI-generated · AI-managed · AI-maintained
"use client";

import { Link } from "../../i18n/navigation";
import { Github, Twitter, Sparkles, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

export function MainFooter() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");

  const footerLinks = [
    {
      title: t("products"),
      links: [
        { label: t("wallet"), href: "/resources/wallet" },
        { label: t("mint"), href: "/resources/mining" },
        { label: t("auction"), href: "/resources/auctions" },
        { label: t("governance"), href: "/resources/governance" },
      ],
    },
    {
      title: t("developers"),
      links: [
        { label: t("docs"), href: "/developers" },
        { label: t("api"), href: "/developers/api" },
        { label: t("sdk"), href: "/developers/sdk" },
      ],
    },
    {
      title: t("resources"),
      links: [
        { label: t("whitepaper"), href: "/docs/whitepaper" },
        { label: t("data"), href: "/data" },
        { label: t("community"), href: "/community" },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "/about" },
        { label: t("terms"), href: "/docs/legal/terms-of-service" },
        { label: t("privacy"), href: "/docs/legal/privacy-policy" },
      ],
    },
  ];

  return (
    <footer className="bg-[#030712] border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 2xs:px-5 xs:px-6 py-8 2xs:py-10 xs:py-12 sm:py-14 md:py-16">
        {/* Links grid \u2014 1 col on tiny, 2 on small, 3 on medium, 5 on large */}
        <div className="grid grid-cols-1 2xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 2xs:gap-7 xs:gap-8">
          {/* Brand column \u2014 full width on small, 1 col on medium+ */}
          <div className="2xs:col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <Sparkles size={16} className="xs:hidden text-blue-500" />
              <Sparkles size={18} className="hidden xs:block text-blue-500" />
              <span className="text-lg xs:text-xl font-bold text-white">Microcosm</span>
            </Link>
            <p className="mt-3 xs:mt-4 text-xs xs:text-sm text-slate-500 leading-relaxed break-safe">
              {t("tagline1")}
              <br className="hidden xs:block" />
              <span className="xs:hidden"> </span>
              {t("tagline2")}
            </p>
            <div className="flex items-center gap-3 mt-4 xs:mt-6">
              <a
                href="https://x.com/MicrocosmMoney"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 xs:p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all touch-target"
              >
                <Twitter size={14} className="xs:hidden" />
                <Twitter size={16} className="hidden xs:block" />
              </a>
              <a
                href="https://github.com/MicrocosmMoney/Microcosm"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 xs:p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all touch-target"
              >
                <Github size={14} className="xs:hidden" />
                <Github size={16} className="hidden xs:block" />
              </a>
            </div>
          </div>

          {/* Link columns \u2014 hide less important ones on very small screens */}
          {footerLinks.map((group, idx) => (
            <div key={group.title} className={idx >= 3 ? "hidden 2xs:block" : ""}>
              <h3 className="text-xs xs:text-sm font-semibold text-white mb-2.5 xs:mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2 xs:space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs xs:text-sm text-slate-500 hover:text-slate-300 transition-colors break-safe"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA banner \u2014 compact on small screens */}
        <div className="mt-10 xs:mt-12 sm:mt-16 p-4 xs:p-5 sm:p-6 rounded-xl xs:rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
          <div className="flex flex-col xs:flex-col sm:flex-row sm:items-center justify-between gap-3 xs:gap-4">
            <div className="min-w-0">
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-white mb-0.5 xs:mb-1 break-safe">
                {t("joinEcosystem")}
              </h3>
              <p className="text-xs xs:text-sm text-slate-400 break-safe">
                {t("exploreDecentralized")}
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 bg-blue-500 text-white rounded-full text-xs xs:text-sm font-medium hover:bg-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all shrink-0 touch-target"
            >
              {t("startNow")}
              <ExternalLink size={12} className="xs:hidden" />
              <ExternalLink size={14} className="hidden xs:block" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 2xs:px-5 xs:px-6 py-4 xs:py-6">
          <div className="flex flex-col xs:flex-row justify-between items-center gap-3 xs:gap-4">
            <p className="text-[10px] 2xs:text-xs xs:text-sm text-slate-600">
              © 2026 Microcosm. All rights reserved.
            </p>
            <div className="flex items-center gap-4 xs:gap-6">
              <Link
                href="/docs/legal/terms-of-service"
                className="text-[10px] 2xs:text-xs xs:text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                {t("termsOfService")}
              </Link>
              <Link
                href="/docs/legal/privacy-policy"
                className="text-[10px] 2xs:text-xs xs:text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                {t("privacyPolicy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
