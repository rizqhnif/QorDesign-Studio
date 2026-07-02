"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const products = [
  {
    id: 1,
    title: "Solitude in Bloom",
    category: "Illustration",
    price: 5000000,
    priceMax: 5350000,
    tag: "Popular",
    image: "/image/cewe-selfie.png",
    format: "PNG, PSD",
  },
  {
    id: 2,
    title: "Golden Hour Memories",
    category: "Illustration",
    price: 5000000,
    priceMax: 5350000,
    tag: "New",
    image: "/image/cewe-selfie-lagi.png",
    format: "PNG, PSD",
  },
  {
    id: 3,
    title: "Nani Wartabone – Heritage Poster",
    category: "Graphic Design",
    price: 5000000,
    priceMax: 5500000,
    tag: "New",
    image: "/image/nani-wartabone.png",
    format: "PNG, AI",
  },
  {
    id: 4,
    title: "Hero of Time – Full Character Sheet",
    category: "Character Design",
    price: 5000000,
    priceMax: 5250000,
    tag: "Hot",
    image: "/image/design-karakter-1.png",
    format: "PNG, PSD",
  },
  {
    id: 5,
    title: "Ayah Laras – Character Sheet",
    category: "Character Design",
    price: 5000000,
    priceMax: 5250000,
    tag: "New",
    image: "/image/design-karakter-2.png",
    format: "PNG, PSD",
  },
  {
    id: 6,
    title: "Amel – Original Character Sheet",
    category: "Character Design",
    price: 5000000,
    priceMax: 5200000,
    tag: "New",
    image: "/image/design-karakter-3.png",
    format: "PNG, PSD",
  },
  {
    id: 7,
    title: "Laras – Character Concept",
    category: "Character Design",
    price: 5000000,
    priceMax: 5200000,
    tag: "New",
    image: "/image/design-karakter-4.png",
    format: "PNG, PSD",
  },
  {
    id: 8,
    title: "Riko Street Style – Character Turnaround",
    category: "Character Design",
    price: 5000000,
    priceMax: 5200000,
    tag: "New",
    image: "/image/design-karakter-5.png",
    format: "PNG, PSD",
  },
  {
    id: 9,
    title: "The Wanderer – Pose & Expression Pack",
    category: "Character Design",
    price: 5000000,
    priceMax: 5200000,
    tag: "Popular",
    image: "/image/design-karakter-6.png",
    format: "PNG, PSD",
  },
  {
    id: 10,
    title: "Urban Explorer – Character Sheet",
    category: "Character Design",
    price: 5000000,
    priceMax: 5200000,
    tag: "New",
    image: "/image/design-karakter-7.jpg",
    format: "JPG, PSD",
  },
  {
    id: 11,
    title: "Dusk Rider – Character Concept Art",
    category: "Character Design",
    price: 5000000,
    priceMax: 5200000,
    tag: "New",
    image: "/image/design-karakter-8.png",
    format: "PNG, PSD",
  },
  {
    id: 12,
    title: "Phantom Coat – Character Design",
    category: "Character Design",
    price: 5000000,
    priceMax: 5200000,
    tag: "New",
    image: "/image/design-karakter-9.png",
    format: "PNG, PSD",
  },
  {
    id: 13,
    title: "Quiet Afternoon – Pose Reference",
    category: "Illustration",
    price: 5000000,
    priceMax: 5350000,
    tag: "New",
    image: "/image/orang-duduk.png",
    format: "PNG",
  },
  {
    id: 14,
    title: "Plastik Mu Racun Ku – Campaign Poster",
    category: "Graphic Design",
    price: 5000000,
    priceMax: 5500000,
    tag: "Hot",
    image: "/image/plastik-mu-racun-ku.png",
    format: "PNG, AI",
  },
  {
    id: 15,
    title: "Iron Sentinel – Robot Concept Art",
    category: "Illustration",
    price: 5000000,
    priceMax: 5350000,
    tag: "Popular",
    image: "/image/robot.png",
    format: "PNG, PSD",
  },
  {
    id: 16,
    title: "Asta Showroom – Promotional Banner",
    category: "Graphic Design",
    price: 5000000,
    priceMax: 5500000,
    tag: "New",
    image: "/image/banner.png",
    format: "PNG, AI",
  },
  {
    id: 17,
    title: "QorDesign Studio – Brand Identity Pack",
    category: "Branding",
    price: 5000000,
    priceMax: 5400000,
    tag: "Popular",
    image: "/image/logo.png",
    format: "PNG, SVG, AI",
  },
  {
    id: 18,
    title: "VGA RTX 3060 Ti 8GB MSI GAMING X TRIO GDDR6",
    category: "VGA",
    price: 3200000,
    priceMax: 5000000,
    tag: "Recommended",
    image: "/image/rtx3060Ti.png",
    format: "PNG, PSD",
  },
  {
    id: 19,
    title: "COLORFUL IGAME RTX 3060 ULTRA W OC 12GB GDDR6 NVIDIA VGA/RTX 3060",
    category: "VGA",
    price: 3200000,
    priceMax: 5000000,
    tag: "Recommended",
    image: "/image/colorful.png",
    format: "PNG, PSD",
  },
  {
    id: 20,
    title: "ZOTAC GAMING GEFORCE RTX 4060 Ti TWIN EDGE OC WHITE 8GB GDDR6 NVIDIA /4060Ti6",
    category: "VGA",
    price: 3200000,
    priceMax: 5000000,
    tag: "Recommended",
    image: "/image/zotac.png",
    format: "PNG, PSD",
  },
  {
    id: 21,
    title: "PSU VURRION ARC450 RGB FROST EDITION 80+ / POWER SUPLAY 450W",
    category: "PSU",
    price: 3200000,
    priceMax: 5000000,
    tag: "Recommended",
    image: "/image/frostEdition.png",
    format: "PNG, PSD",
  },
  {
    id: 22,
    title: "THERMALRIGHT KG-750 / KG 750 PSU POWER suplay 750W 80+ GOLD ATX 3.1 Fully Modular",
    category: "PSU",
    price: 3200000,
    priceMax: 5000000,
    tag: "Recommended",
    image: "/image/psu.png",
    format: "PNG, PSD",
  },
  {
    id: 23,
    title: "TEAM ELITE PLUS DDR4 16GB 2x8GB 3200 MHz RAM",
    category: "RAM",
    price: 3200000,
    priceMax: 5000000,
    tag: "Recommended",
    image: "/image/ram.png",
    format: "PNG, PSD",
  },
  {
    id: 24,
    title: "ADATA SPECTRIX D35D RGB DDR4 16GB 2x8GB 3200 MHz - Putih",
    category: "RAM",
    price: 3200000,
    priceMax: 5000000,
    tag: "Recommended",
    image: "/image/adata.png",
    format: "PNG, PSD",
  },
  {
    id: 25,
    title: "VGA RTX 3060 12GB ZOTAC TWIN EDGE OC GDDR6",
    category: "VGA",
    price: 3200000,
    priceMax: 5000000,
    tag: "Recommended",
    image: "/image/zotacDua.png",
    format: "PNG, PSD",
  },
];

const tagColors: Record<string, string> = {
  New: "bg-green-500/20 text-green-400 border-green-500/30",
  Popular: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Hot: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Recommended: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const preferredCategoryOrder = [
  "Illustration",
  "Character Design",
  "Graphic Design",
  "Branding",
];

const categories = [
  "All",
  ...Array.from(new Set(products.map((product) => product.category))).sort(
    (left, right) => {
      const leftIndex = preferredCategoryOrder.indexOf(left);
      const rightIndex = preferredCategoryOrder.indexOf(right);

      if (leftIndex !== -1 || rightIndex !== -1) {
        if (leftIndex === -1) return 1;
        if (rightIndex === -1) return -1;

        return leftIndex - rightIndex;
      }

      return left.localeCompare(right);
    },
  ),
];

function formatPrice(price: number) {
  return (
    "IDR " +
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(price)
  );
}

function formatPriceRange(price: number, maxPrice?: number) {
  return `${formatPrice(price)} - ${formatPrice(maxPrice ?? price * 2)}`;
}

export default function FeaturedProducts() {
  const { addItem, items } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");

  const handleAdd = (product: (typeof products)[0]) => {
    addItem(product);
  };

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section
      id="products"
      className="py-24 bg-[#1a3a1a] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-yellow-400 text-sm font-medium tracking-widest uppercase mb-3 block">
              Digital Assets
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Our <span className="text-yellow-400">Products</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeCategory === cat
                    ? "bg-yellow-400 text-[#6B0000] border-yellow-400 font-bold"
                    : "border-yellow-400/20 text-yellow-400/60 hover:border-yellow-400/60 hover:text-yellow-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl overflow-hidden border border-yellow-400/10 hover:border-yellow-400/40 transition-all duration-300 bg-[#6B0000]/40"
            >
              {/* Product image */}
              <div className="relative h-52 overflow-hidden bg-[#8B0000]/30">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tagColors[product.tag]}`}
                  >
                    {product.tag}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="text-yellow-400/60 text-xs mb-1">
                  {product.category}
                </div>
                <h3 className="text-white font-semibold text-sm mb-3 leading-snug line-clamp-2">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="text-yellow-400 font-bold text-sm">
                    {formatPriceRange(product.price, product.priceMax)}
                  </div>
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={items.some((i) => i.id === product.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 ${
                      items.some((i) => i.id === product.id)
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                        : "bg-yellow-400 text-[#6B0000] hover:bg-yellow-300"
                    }`}
                  >
                    {items.some((i) => i.id === product.id) ? (
                      <>
                        <Check size={12} /> In Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={12} /> Add
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={10}
                      className="text-yellow-400/40 fill-yellow-400/40"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
    </section>
  );
}
