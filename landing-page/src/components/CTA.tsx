"use client";

import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CTA() {
    const { t } = useTranslation();

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-white/10 p-10 md:p-16 text-center overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {t("cta.title")}
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
                            {t("cta.subtitle")}
                        </p>
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full text-white font-semibold text-lg transition-all transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]">
                            {t("cta.button")}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
