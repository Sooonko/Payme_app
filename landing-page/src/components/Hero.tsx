"use client";

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
                            {/* App Store Button */}
                            <button className="flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl transition-all group">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">{t("hero.downloadOn")}</div>
                                    <div className="text-lg font-semibold leading-none text-white">{t("hero.appStore")}</div>
                                </div>
                            </button>

                            {/* Google Play Button */}
                            <button className="flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl transition-all group">
                                <svg viewBox="0 0 24 24" className="w-8 h-8">
                                    <path fill="#EA4335" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" />
                                    <path fill="#FBBC05" d="M15.569 5.725l-3.528-2.016-5.83-3.32a.998.998 0 0 1 .15-.098l9.208 5.434z" />
                                    <path fill="#34A853" d="M5.138 17.744a1.002 1.002 0 0 1-.15-.098l5.83-3.32 3.528-2.018-9.208 5.436z" />
                                    <path fill="#4285F4" d="M15.569 13.225l-3.056-3.056 3.056-3.054 4.027 2.292a1 1 0 0 1 0 1.528l-4.027 2.29z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">{t("hero.getItOn")}</div>
                                    <div className="text-lg font-semibold leading-none text-white">{t("hero.googlePlay")}</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Hero Image / Mockup */}
                    <div className="relative flex justify-center items-center">
                        {/* Background gradient overlay to blend the phone */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B]/50 via-transparent to-[#5B21B6]/50 rounded-3xl" />

                        {/* Phone Mockup Image */}
                        <img
                            src="/phone-mockup.png"
                            alt="Payme App Mockup"
                            className="relative z-10 w-auto h-[500px] lg:h-[600px] object-contain drop-shadow-2xl opacity-90"
                            style={{
                                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
                            }}
                        />

                        {/* Decor Elements around phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[128px] -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
