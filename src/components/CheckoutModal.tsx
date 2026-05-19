"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

function formatPrice(price: number) {
  return (
    "IDR " +
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(price)
  );
}

export default function CheckoutModal({ open, onClose }: Props) {
  const { items, total, clearCart } = useCart();
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
          items,
          buyerName: form.name,
          buyerEmail: form.email,
          buyerPhone: form.phone,
          type: "product",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Redirect to Midtrans payment page
      clearCart();
      window.location.href = data.invoiceUrl;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
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
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-yellow-400" />
                  <span className="text-white font-bold">Checkout</span>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Order summary */}
              <div className="px-6 py-4 bg-[#6B0000]/20 border-b border-yellow-400/10">
                <div className="space-y-1 mb-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/60 truncate mr-2">
                        {item.title}
                      </span>
                      <span className="text-white/80 flex-shrink-0">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold border-t border-yellow-400/10 pt-2">
                  <span className="text-white">Total</span>
                  <span className="text-yellow-400">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
                  <p className="text-white/30 text-xs mt-1">
                    Download link will be sent here
                  </p>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition-colors"
                  />
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
                    <>
                      <Loader2 size={18} className="animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>

                <p className="text-white/20 text-xs text-center">
                  Secured by Midtrans · Bank Transfer, E-Wallet, QRIS, Credit Card
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
