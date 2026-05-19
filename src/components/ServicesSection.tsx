"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check, CreditCard, X, Loader2 } from "lucide-react";

const WA_NUMBER = "6281243898588";

const services = [
  {
    title: "Custom Illustration",
    desc: "Ilustrasi digital custom sesuai kebutuhan — portrait, scene, fan art, atau konsep original.",
    price: 15000000,
    features: [
      "Konsultasi konsep & brief",
      "2x revisi",
      "File PNG resolusi tinggi + PSD",
      "Estimasi 5–7 hari kerja",
    ],
    tag: "Most Popular",
    bg: "#1a3a1a",
    highlight: false,
  },
  {
    title: "Character Design Package",
    desc: "Desain karakter lengkap dari konsep hingga final — cocok untuk game, animasi, webtoon, atau branding.",
    price: 18000000,
    features: [
      "Character sheet lengkap (front, side, back)",
      "Expression & pose pack",
      "Color palette guide",
      "3x revisi",
      "File PNG + PSD + PDF",
      "Estimasi 7–10 hari kerja",
    ],
    tag: "Best Value",
    bg: "#8B0000",
    highlight: true,
  },
  {
    title: "Brand Identity Design",
    desc: "Identitas visual lengkap untuk bisnis atau personal brand — logo, warna, tipografi, dan panduan penggunaan.",
    price: 17500000,
    features: [
      "Logo design (3 konsep awal)",
      "Color palette & typography",
      "Brand guideline PDF",
      "File SVG, PNG, AI",
      "3x revisi",
      "Estimasi 7–10 hari kerja",
    ],
    tag: null,
    bg: "#1a3a1a",
    highlight: false,
  },
  {
    title: "Motion Graphic / 2D Animation",
    desc: "Animasi 2D atau motion graphic untuk konten sosial media, presentasi, iklan, atau proyek kreatif.",
    price: 20000000,
    features: [
      "Konsultasi storyboard",
      "Animasi durasi hingga 60 detik",
      "Format MP4 + GIF",
      "2x revisi",
      "Estimasi 10–14 hari kerja",
    ],
    tag: "Premium",
    bg: "#8B0000",
    highlight: false,
  },
];

type Service = (typeof services)[0];

function formatPrice(price: number) {
  return (
    "IDR " +
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(price)
  );
}

function buildWAMessage(service: string, price: number) {
  const msg = `Halo QorDesign Studio! 👋\n\nSaya tertarik dengan jasa *${service}* (${formatPrice(price)}).\n\nBoleh info lebih lanjut mengenai proses dan cara pemesanannya? Terima kasih!`;
  return encodeURIComponent(msg);
}

// Modal checkout untuk jasa
function ServiceCheckoutModal({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: service.title, title: service.title, price: service.price }],
          buyerName: form.name,
          buyerEmail: form.email,
          buyerPhone: form.phone,
          type: "service",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan");
        return;
      }

      window.location.href = data.invoiceUrl;
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-[111] flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-[#1a3a1a] rounded-2xl border border-yellow-400/20 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-400/10">
            <div>
              <div className="text-yellow-400 text-xs mb-0.5">Checkout Jasa</div>
              <div className="text-white font-bold text-sm">{service.title}</div>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Harga */}
          <div className="px-6 py-3 bg-[#6B0000]/20 border-b border-yellow-400/10 flex justify-between items-center">
            <span className="text-white/60 text-sm">Total</span>
            <span className="text-yellow-400 font-black">{formatPrice(service.price)}</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama lengkap kamu"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@kamu.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
              <p className="text-white/30 text-xs mt-1">Konfirmasi order akan dikirim ke email ini</p>
            </div>
            <div>
              <label className="text-white/60 text-xs mb-1.5 block">Nomor WhatsApp *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
              <p className="text-white/30 text-xs mt-1">Kami akan menghubungi kamu via WhatsApp setelah pembayaran</p>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-[#6B0000] font-bold py-3.5 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Memproses...</>
              ) : (
                <><CreditCard size={18} /> Lanjut ke Pembayaran</>
              )}
            </button>

            <p className="text-white/20 text-xs text-center">
              Diamankan oleh Xendit · Transfer Bank, E-Wallet, QRIS, Kartu Kredit
            </p>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <>
      <section id="services" className="py-24 bg-[#6B0000] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />

        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "radial-gradient(circle, #FFD700 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase mb-3 block">
              Hire Us
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Design <span className="text-yellow-400">Services</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Butuh karya custom? Kami siap mengerjakan proyek desain sesuai kebutuhan dan visi kamu.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl p-6 border flex flex-col transition-all duration-300 ${
                  service.highlight
                    ? "border-yellow-400/60 shadow-lg shadow-yellow-400/10"
                    : "border-yellow-400/10 hover:border-yellow-400/30"
                }`}
                style={{ background: service.bg }}
              >
                {service.tag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-[#6B0000] text-xs font-black px-3 py-1 rounded-full whitespace-nowrap">
                      {service.tag}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-white font-black text-lg mb-2 mt-2">{service.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{service.desc}</p>
                  <div className="text-yellow-400 font-black text-2xl mb-1">{formatPrice(service.price)}</div>
                  <p className="text-white/30 text-xs mb-6">per project</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-white/60">
                        <Check size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2 tombol */}
                <div className="flex flex-col gap-2">
                  {/* Checkout via Xendit */}
                  <button
                    onClick={() => setSelectedService(service)}
                    className={`flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl transition-all text-sm ${
                      service.highlight
                        ? "bg-yellow-400 text-[#6B0000] hover:bg-yellow-300"
                        : "bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20"
                    }`}
                  >
                    <CreditCard size={15} />
                    Checkout
                  </button>

                  {/* Order via WhatsApp */}
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${buildWAMessage(service.title, service.price)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 font-medium py-2.5 rounded-xl border border-white/10 text-white/50 hover:border-green-500/40 hover:text-green-400 transition-all text-sm"
                  >
                    <MessageCircle size={15} />
                    Order via WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-white/30 text-xs mt-10"
          >
            Harga dapat berubah tergantung kompleksitas proyek. Hubungi kami untuk diskusi lebih lanjut.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
      </section>

      {/* Checkout Modal */}
      {selectedService && (
        <ServiceCheckoutModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}
