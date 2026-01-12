"use client";

import { Apple } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Hero() {
    const { t } = useTranslation();

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                            {t("hero.title1")} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                {t("hero.title2")}
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                            {t("hero.subtitle")}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                            <button className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-sm transition-all group">
                                <Apple fill="currentColor" className="w-8 h-8" />
                                <div className="text-left">
                                    <div className="text-xs text-gray-400">{t("hero.downloadOn")}</div>
                                    <div className="text-lg font-semibold leading-none">{t("hero.appStore")}</div>
                                </div>
                            </button>

                            <button className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl backdrop-blur-sm transition-all group">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm11.96 11.411l-3.056-3.056 3.056-3.054 4.027 2.292a1 1 0 0 1 0 1.528l-4.027 2.29zm-1.223-7.5l-3.528-2.016-5.83-3.32a.998.998 0 0 1 .15-.098l9.208 5.434zm-9.208 12.019a1.002 1.002 0 0 1-.15-.098l5.83-3.32 3.528-2.018-9.208 5.436z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-gray-400">{t("hero.getItOn")}</div>
                                    <div className="text-lg font-semibold leading-none">{t("hero.googlePlay")}</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Hero Image / Mockup */}
                    <div className="relative flex justify-center items-center">
                        {/* Phone Mockup Image */}
                        <img
                            src="/phone-mockup.png"
                            alt="Payme App Mockup"
                            className="w-auto h-[500px] lg:h-[600px] object-contain drop-shadow-2xl"
                        />

                        {/* Decor Elements around phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[128px] -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
