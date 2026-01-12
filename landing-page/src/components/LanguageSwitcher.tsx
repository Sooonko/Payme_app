"use client";

import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const languages = [
    { code: "mn", label: "Монгол", flag: "🇲🇳" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all text-sm font-medium"
            >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <Globe size={16} className="opacity-70" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 rounded-xl bg-black/80 backdrop-blur-lg border border-white/10 shadow-xl overflow-hidden z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${i18n.language === lang.code ? "bg-purple-500/20 text-purple-300" : "text-white"
                                }`}
                        >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="font-medium">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
