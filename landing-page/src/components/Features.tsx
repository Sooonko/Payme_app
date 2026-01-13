"use client";

import { Banknote, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Features() {
    const { t } = useTranslation();

    const features = [

        {
            icon: ShieldCheck,
            title: t("features.security.title"),
            description: t("features.security.description"),
            color: "bg-purple-500",
        },
        {
            icon: Wallet,
            title: t("features.wallet.title"),
            description: t("features.wallet.description"),
            color: "bg-pink-500",
        },
        {
            icon: Banknote,
            title: t("features.loans.title"),
            description: t("features.loans.description"),
            color: "bg-green-500",
        },
        {
            icon: CreditCard,
            title: t("features.cards.title"),
            description: t("features.cards.description"),
            color: "bg-orange-500",
        },
    ];

    return (
        <section id="features" className="py-20 bg-black/5 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("features.sectionTitle")}</h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        {t("features.sectionSubtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 justify-center">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${feature.color} bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`w-7 h-7 ${feature.color.replace('bg-', 'text-')}`} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
