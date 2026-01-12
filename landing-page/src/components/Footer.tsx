"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-lg pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center">
                                <span className="text-white font-bold">P</span>
                            </div>
                            <span className="text-xl font-bold">Payme</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t("footer.description")}
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">{t("footer.product")}</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#features" className="hover:text-purple-400 transition-colors">{t("footer.features")}</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">{t("footer.pricing")}</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">{t("footer.security")}</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">{t("footer.download")}</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">{t("footer.company")}</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="#about" className="hover:text-purple-400 transition-colors">{t("footer.about")}</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">{t("footer.careers")}</Link></li>
                            <li><Link href="#" className="hover:text-purple-400 transition-colors">{t("footer.press")}</Link></li>
                            <li><Link href="#contact" className="hover:text-purple-400 transition-colors">{t("footer.contact")}</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-bold mb-6 text-white">{t("footer.followUs")}</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-purple-400 transition-all">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-purple-400 transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-purple-400 transition-all">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} {t("footer.copyright")}
                    </p>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <Link href="#" className="hover:text-gray-300">{t("footer.privacy")}</Link>
                        <Link href="#" className="hover:text-gray-300">{t("footer.terms")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
