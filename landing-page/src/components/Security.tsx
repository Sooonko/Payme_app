"use client";

import { Eye, Fingerprint, Lock, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Security() {
    const { t } = useTranslation();

    const securityFeatures = [
        {
            icon: Shield,
            title: t("security.bankGrade.title"),
            description: t("security.bankGrade.description"),
        },
        {
            icon: Lock,
            title: t("security.encryption.title"),
            description: t("security.encryption.description"),
        },
        {
            icon: Fingerprint,
            title: t("security.biometric.title"),
            description: t("security.biometric.description"),
        },
        {
            icon: Eye,
            title: t("security.monitoring.title"),
            description: t("security.monitoring.description"),
        },
    ];

    return (
        <section id="about" className="py-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("security.title")}</h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        {t("security.subtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {securityFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group text-center"
                        >
                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <feature.icon className="w-7 h-7 text-green-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
