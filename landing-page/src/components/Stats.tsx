"use client";

import { useTranslation } from "react-i18next";

export default function Stats() {
    const { t } = useTranslation();

    const stats = [
        { value: "100K+", label: t("stats.users") },
        { value: "5+", label: t("stats.countries") },
        { value: "₮10M+", label: t("stats.transactions") },
        { value: "99.9%", label: t("stats.uptime") },
    ];

    return (
        <section className="py-16 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-sm border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
