"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "@/components/CheckoutModal";

function formatPrice(price: number) {
  return (
    "IDR " +
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(price)
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, total } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#1a3a1a] border-l border-yellow-400/20 z-[101] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-yellow-400/10">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-yellow-400" />
                  <span className="text-white font-bold">Cart</span>
                  {items.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-yellow-400 text-[#6B0000] text-xs font-black flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <ShoppingBag size={48} className="text-white/10" />
                    <p className="text-white/40 text-sm">Your cart is empty</p>
                    <button
                      onClick={onClose}
                      className="text-yellow-400 text-sm hover:underline"
                    >
                      Browse products
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-xl bg-[#6B0000]/30 border border-yellow-400/10"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-yellow-400/60 text-xs mt-0.5">
                          {item.category}
                        </p>
                        <p className="text-yellow-400 font-bold text-sm mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0 mt-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-6 py-5 border-t border-yellow-400/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Total</span>
                    <span className="text-yellow-400 font-black text-lg">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      setCheckoutOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-[#6B0000] font-bold py-3.5 rounded-xl transition-colors"
                  >
                    <CreditCard size={18} />
                    Checkout
                  </button>
                  <p className="text-white/30 text-xs text-center">
                    Secured by Xendit · Bank Transfer, E-Wallet, QRIS
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
