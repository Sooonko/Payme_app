"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
    const { t } = useTranslation();

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300",
            "border-b border-white/10 bg-black/20 backdrop-blur-md"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                            Payme
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            {t("nav.features")}
                        </Link>
                        <Link href="#about" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            {t("nav.about")}
                        </Link>
                        <Link href="#contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            {t("nav.contact")}
                        </Link>
                    </div>

                    {/* Buttons + Language Switcher */}
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <button
                            className="hidden md:block text-sm font-semibold text-white px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition-all cursor-default"
                        >
                            {t("nav.login")}
                        </button>
                        <button
                            className="text-sm font-semibold text-white px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all transform hover:-translate-y-0.5 cursor-default"
                        >
                            {t("nav.getStarted")}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
