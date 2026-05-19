"use client";

import { Mail, Phone } from "lucide-react";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1a3a1a] border-t border-yellow-400/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center font-black text-[#6B0000] text-sm">
                Q
              </div>
              <span className="font-bold text-white">
                QorDesign <span className="text-yellow-400">Studio</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Premium digital design assets. Beautiful Visuals, Powerful
              Stories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="#products"
                className="text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                Products
              </a>
              <a
                href="#about"
                className="text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                Contact Us
              </a>
              <a
                href="/faq"
                className="text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                FAQ
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
            <div className="flex flex-col gap-2">
              <a
                href="/terms"
                className="text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                Terms & Conditions
              </a>
              <a
                href="/refund-policy"
                className="text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                Refund Policy
              </a>
              <a
                href="/privacy-policy"
                className="text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:naufalalqorny@gmail.com"
                className="flex items-center gap-2 text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                <Mail size={14} />
                naufalalqorny@gmail.com
              </a>
              <a
                href="https://wa.me/6281243898588"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                <Phone size={14} />
                081243898588
              </a>
              <a
                href="https://instagram.com/qornyjusuf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 hover:text-yellow-400 transition-colors text-sm"
              >
                <InstagramIcon size={14} />
                @qordesignstudio
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-yellow-400/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">
              © 2025 PT. QorDesign Studio. All rights reserved.
            </p>
            {/* Legal links inline — visible for Xendit review */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/30">
              <a
                href="/terms"
                className="hover:text-yellow-400 transition-colors"
              >
                Terms & Conditions
              </a>
              <span>|</span>
              <a
                href="/refund-policy"
                className="hover:text-yellow-400 transition-colors"
              >
                Refund Policy
              </a>
              <span>|</span>
              <a
                href="/privacy-policy"
                className="hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </a>
              <span>|</span>
              <a
                href="/contact"
                className="hover:text-yellow-400 transition-colors"
              >
                Contact Us
              </a>
            </div>
            <p className="text-white/30 text-xs">
              Payment by <span className="text-yellow-400/60">Xendit</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
