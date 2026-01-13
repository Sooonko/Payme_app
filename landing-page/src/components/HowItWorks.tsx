"use client";

import { Download, Send, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HowItWorks() {
    const { t } = useTranslation();

    const steps = [
        {
            icon: Download,
            step: "01",
            title: t("howItWorks.step1.title"),
            description: t("howItWorks.step1.description"),
            color: "from-cyan-500 to-blue-500",
        },
        {
            icon: UserPlus,
            step: "02",
            title: t("howItWorks.step2.title"),
            description: t("howItWorks.step2.description"),
            color: "from-purple-500 to-pink-500",
        },
        {
            icon: Send,
            step: "03",
            title: t("howItWorks.step3.title"),
            description: t("howItWorks.step3.description"),
            color: "from-green-500 to-emerald-500",
        },
    ];

    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("howItWorks.title")}</h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        {t("howItWorks.subtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connection Line */}
                    <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500 opacity-30" />

                    {steps.map((item, index) => (
                        <div key={index} className="relative text-center group">
                            {/* Step Number */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-7xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                                {item.step}
                            </div>

                            {/* Icon */}
                            <div className={`relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-10 h-10 text-white" />
                            </div>

                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
