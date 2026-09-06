import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  Ruler,
  X,
} from 'lucide-react';
import VariableProximity from './VariableProximity';
import RotatingText from './RotatingText';
import Magnetic from './Magnetic';
import { useShop } from '@/context/ShopContext';
import { getProductById, getPriceForSize, getSizeDisplayName } from '@/data/products';
import Navbar from './Navbar';
import Footer from './Footer';
import { ShopNotification } from './ShopNotification';
import CurvedLoop from './CurvedLoop';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    selectedColorIndex,
    navigate,
    addToCart,
    showNotification,
  } = useShop();

  const product = getProductById(selectedProductId);

  const [activeColorIdx, setActiveColorIdx] = useState(selectedColorIndex);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'materials' | 'shipping' | 'care'>('description');

  useEffect(() => {
    setActiveColorIdx(selectedColorIndex);
  }, [selectedColorIndex, selectedProductId]);

  const activeColor = product.colors[activeColorIdx] || product.colors[0];
  const unitPrice = getPriceForSize(selectedSize, product.price);
  const totalPrice = unitPrice * quantity;

  return (
    <div className="min-h-screen bg-white text-navy flex flex-col">
      <Navbar />

      {/* Main Container with Entrance Animation */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 pt-24 pb-20 sm:pt-28 sm:pb-28"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Back to Shop Link */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#0CC0DF]/30 bg-white px-4 py-2 text-xs font-bold text-navy transition-all duration-300 hover:bg-navy hover:text-white hover:border-navy shadow-sm"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0CC0DF] text-white shadow-sm transition-transform group-hover:scale-110">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              </span>
              Back to Shop
            </button>
          </div>

          {/* Top Section: Showcase Gallery & Purchase Controls */}
          <div id="shop" className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            {/* Left Column: Compact Proportional Visual Card & Swatch Gallery (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center w-full">
              {/* Main Image Container */}
              <div className="group relative flex w-full max-w-[480px] aspect-square items-center justify-center rounded-3xl bg-navy/5 p-6 sm:p-8 border border-navy/10 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                {/* Active Product Image */}
                <motion.img
                  key={activeColor.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  src={activeColor.image}
                  alt={`${product.name} - ${activeColor.name}`}
                  className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                />
                
                {/* Color Name Tag */}
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 backdrop-blur-sm border border-navy/10 px-3.5 py-1 text-xs font-bold text-navy shadow-sm">
                  {activeColor.name}
                </span>
              </div>

              {/* Color Swatch Thumbnails */}
              <div className="mt-5 flex items-center justify-center gap-3">
                {product.colors.map((col, idx) => (
                  <button
                    key={col.name}
                    onClick={() => setActiveColorIdx(idx)}
                    aria-label={`Select ${col.name}`}
                    className={`group relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-2xl border bg-white p-1.5 transition-all duration-300 ${
                      activeColorIdx === idx
                        ? 'border-2 border-[#0CC0DF] ring-2 ring-[#0CC0DF]/30 scale-105 shadow-sm'
                        : 'border-navy/10 hover:border-navy/30'
                    }`}
                  >
                    <img
                      src={col.image}
                      alt={col.name}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Details & Order Controls (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div>
                {/* Category & Status */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-royal">
                    {product.category}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-navy/20" />
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> In Stock
                  </span>
                </div>

                {/* Title */}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-3xl font-extrabold tracking-tightest text-navy sm:text-4xl md:text-5xl font-montserrat">
                    Modaline
                  </span>
                  <span className="relative flex items-center justify-start text-navy text-3xl font-extrabold tracking-tightest sm:text-4xl md:text-5xl font-montserrat">
                    <span className="invisible pointer-events-none">Comfortable</span>
                    <span className="absolute inset-0 flex items-center justify-start">
                      <RotatingText
                        texts={['Affordable', 'Durable', 'Comfortable']}
                        mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                        staggerFrom="last"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                        splitBy="characters"
                        auto
                        loop
                      />
                    </span>
                  </span>
                </div>

                {/* Subtitle / Collection Tag */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-navy/60">Modaline Essentials · Everyday Wear</span>
                </div>

                {/* Pricing */}
                <div className="mt-4 flex flex-wrap items-baseline gap-3">
                  <VariableProximity
                    label={`₱${totalPrice.toLocaleString('en-PH')}.00`}
                    className="text-3xl font-extrabold text-[#0CC0DF] sm:text-4xl"
                  />
                  {quantity > 1 && (
                    <span className="text-sm font-medium text-navy/50">
                      (₱{unitPrice}.00 each • Subtotal for {quantity} items)
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-5 text-base leading-relaxed text-navy/70 font-montserrat max-w-2xl">
                  {product.description}
                </p>

                {/* Key Features */}
                <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-navy/80">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-[#0CC0DF]" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Color Swatch Controls */}
              <div className="space-y-3 pt-4 border-t border-navy/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-navy">Color:</span>
                  <span className="font-bold text-royal">{activeColor.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((col, idx) => (
                    <button
                      key={col.name}
                      onClick={() => setActiveColorIdx(idx)}
                      aria-label={`Select color ${col.name}`}
                      className={`relative h-10 w-10 rounded-full transition-all duration-300 ${
                        activeColorIdx === idx
                          ? 'ring-2 ring-royal ring-offset-2 ring-offset-white scale-110'
                          : 'ring-1 ring-navy/10 hover:ring-2 hover:ring-navy/20'
                      }`}
                      style={{ backgroundColor: col.value }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector with Live Pricing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-navy">Select Size:</span>
                    <span className="font-bold text-[#0CC0DF]">
                      {getSizeDisplayName(selectedSize)} · ₱{unitPrice}.00
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-royal cursor-pointer hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size & Price Guide
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 pt-3">
                  {product.sizes.map((sz) => {
                    const szPrice = getPriceForSize(sz, product.price);
                    const isSelected = selectedSize === sz;
                    const isHovered = hoveredSize === sz;
                    return (
                      <div
                        key={sz}
                        className="relative flex justify-center group/size"
                        onMouseEnter={() => setHoveredSize(sz)}
                        onMouseLeave={() => setHoveredSize(null)}
                        onTouchStart={() => setHoveredSize(sz)}
                        onTouchEnd={() => setTimeout(() => setHoveredSize(null), 1200)}
                      >
                        {/* Animated Pop-Up Price Tooltip */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.75, y: 8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8, y: 6 }}
                              transition={{
                                type: 'spring',
                                stiffness: 450,
                                damping: 24,
                                mass: 0.6,
                              }}
                              className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center"
                              role="tooltip"
                            >
                              <div className="bg-navy text-white text-xs font-extrabold py-1 px-2.5 rounded-xl shadow-xl border border-white/20 flex items-center gap-1 whitespace-nowrap backdrop-blur-md">
                                <span className="text-[#0CC0DF]">₱{szPrice}</span>
                                <span className="text-white/70 text-[10px] font-semibold">PHP</span>
                              </div>
                              {/* Downward Caret Triangle */}
                              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-navy -mt-[0.5px]" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Size Selection Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          onFocus={() => setHoveredSize(sz)}
                          onBlur={() => setHoveredSize(null)}
                          aria-label={`Size ${sz}, price ₱${szPrice}`}
                          className={`w-full h-12 flex items-center justify-center rounded-2xl transition-all duration-200 cursor-pointer border text-center font-bold text-sm sm:text-base select-none ${
                            isSelected
                              ? 'bg-[#0CC0DF] text-white border-[#0CC0DF] shadow-md shadow-[#0CC0DF]/30 scale-[1.04]'
                              : 'bg-navy/5 text-navy border-navy/10 hover:bg-navy/10 hover:border-navy/25 hover:scale-[1.02] active:scale-95'
                          }`}
                        >
                          <span className="tracking-tight">
                            {sz}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & CTA Actions */}
              <div className="space-y-5 pt-4 border-t border-navy/10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full bg-navy/5 p-1 border border-navy/10">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-navy transition-all hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-extrabold text-base text-navy">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-navy transition-all hover:bg-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="text-xs font-semibold text-navy/60">
                    Total: <span className="font-extrabold text-navy">₱{totalPrice.toLocaleString('en-PH')}.00</span>
                  </span>
                </div>

                {/* Order Action Area */}
                <div className="space-y-3 pt-2">
                  <ShopNotification />

                  {/* Primary Buttons Row */}
                  <div className="flex flex-wrap items-center gap-4">
                  {/* Order Now Button */}
                  <Magnetic>
                    <motion.button
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{
                        scale: 1.04,
                        backgroundColor: '#12d1f0',
                        boxShadow: '0 16px 32px -4px rgba(12, 192, 223, 0.45)',
                        transition: { duration: 0.2, ease: 'easeOut' },
                      }}
                      whileTap={{
                        scale: 0.96,
                        transition: { duration: 0.12, ease: 'easeOut' },
                      }}
                      onClick={() => {
                        addToCart(product.id, activeColor, selectedSize, quantity, { triggerNotification: false });
                        showNotification({
                          type: 'order',
                          productName: product.name,
                          colorName: activeColor.name,
                          size: selectedSize,
                          quantity,
                          totalPrice,
                        });
                      }}
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0CC0DF] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#0CC0DF]/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0CC0DF]/40 focus-visible:ring-offset-2 min-w-44"
                    >
                      ORDER NOW
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </Magnetic>

                  {/* Add to Cart Button */}
                  <Magnetic>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        addToCart(product.id, activeColor, selectedSize, quantity);
                      }}
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-4 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-royal"
                    >
                      Add to Cart
                    </motion.button>
                  </Magnetic>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Product Specifications & Details Tabs */}
          <div className="mt-16 border-t border-navy/10 pt-10">
            <div className="flex border-b border-navy/10 overflow-x-auto gap-8 no-scrollbar">
              {[
                { id: 'description', label: 'Description' },
                { id: 'materials', label: 'Materials & Blend' },
                { id: 'shipping', label: 'Shipping & Returns' },
                { id: 'care', label: 'Care Guide' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`relative pb-3 text-base font-bold transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'text-[#0CC0DF]' : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicatorPage"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0CC0DF] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="py-8 text-base leading-relaxed text-navy/70">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 max-w-3xl"
                  >
                    {product.longDescription.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'materials' && (
                  <motion.div
                    key="materials"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 max-w-2xl"
                  >
                    <ul className="list-disc list-inside space-y-2">
                      {product.materials.map((mat, i) => (
                        <li key={i}>{mat}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {activeTab === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                  >
                    <div className="rounded-2xl bg-navy/5 p-6 flex flex-col items-center text-center">
                      <Truck className="h-8 w-8 text-[#0CC0DF] mb-3" />
                      <span className="font-bold text-navy text-sm">Fast Shipping</span>
                      <span className="text-xs text-navy/60 mt-1">Delivered in 2-4 business days nationwide</span>
                    </div>
                    <div className="rounded-2xl bg-navy/5 p-6 flex flex-col items-center text-center">
                      <ShieldCheck className="h-8 w-8 text-[#0CC0DF] mb-3" />
                      <span className="font-bold text-navy text-sm">Quality Guarantee</span>
                      <span className="text-xs text-navy/60 mt-1">100% authentic materials with quality check</span>
                    </div>
                    <div className="rounded-2xl bg-navy/5 p-6 flex flex-col items-center text-center">
                      <RotateCcw className="h-8 w-8 text-[#0CC0DF] mb-3" />
                      <span className="font-bold text-navy text-sm">Easy Returns</span>
                      <span className="text-xs text-navy/60 mt-1">30-day hassle-free exchanges and returns</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'care' && (
                  <motion.div
                    key="care"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 max-w-2xl"
                  >
                    <p>Take care of your Modaline apparel with these simple steps</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Machine wash with similar colors</li>
                      <li>Use cold or normal water</li>
                      <li>Turn inside out before washing</li>
                      <li>Air dry or tumble dry on low</li>
                      <li>Do not bleach</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Curved Loop Section */}
          <div className="mt-16 border-t-0 pt-6">
            <div className="py-2">
              <CurvedLoop
                marqueeText="Affordable ✦ Durable ✦ Comfortable ✦ Modaline ✦ "
                speed={2}
                curveAmount={120}
                direction="right"
                interactive
              />
            </div>
          </div>
        </div>
      </motion.main>

      {/* Size & Pricing Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-navy/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-navy/10 text-navy"
            >
              <div className="flex items-center justify-between border-b border-navy/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0CC0DF]/15 text-[#0CC0DF]">
                    <Ruler className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-montserrat text-navy">
                      Size & Price Chart
                    </h3>
                    <p className="text-xs text-navy/60">
                      Standard unisex measurements (inches)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="rounded-full p-2 text-navy/40 hover:bg-navy/5 hover:text-navy transition-colors cursor-pointer"
                  aria-label="Close size guide"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Size & Price Table */}
              <div className="mt-5 overflow-hidden rounded-2xl border border-navy/10 shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-navy/5 text-navy font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-3">Chest (Width)</th>
                      <th className="py-3 px-3">Length</th>
                      <th className="py-3 px-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/10 font-medium">
                    {[
                      { size: 'XS', label: 'Extra Small (XS)', chest: '18"', length: '26"' },
                      { size: 'S', label: 'Small (S)', chest: '19"', length: '27"' },
                      { size: 'M', label: 'Medium (M)', chest: '20"', length: '28"' },
                      { size: 'L', label: 'Large (L)', chest: '21"', length: '29"' },
                      { size: 'XL', label: 'Extra Large (XL)', chest: '22"', length: '30"' },
                      { size: '2XL', label: '2XL', chest: '23"', length: '31"' },
                      { size: '3XL', label: '3XL', chest: '24"', length: '32"' },
                    ].map((row) => {
                      const rowPrice = getPriceForSize(row.size, product.price);
                      const isRowSelected = selectedSize === row.size;
                      return (
                        <tr
                          key={row.size}
                          onClick={() => {
                            setSelectedSize(row.size);
                            setIsSizeGuideOpen(false);
                          }}
                          className={`transition-colors cursor-pointer ${
                            isRowSelected
                              ? 'bg-[#0CC0DF]/10 font-bold text-[#00748b]'
                              : 'hover:bg-navy/5'
                          }`}
                        >
                          <td className="py-2.5 px-4 font-bold flex items-center gap-1.5">
                            {row.label}
                            {isRowSelected && (
                              <span className="text-[10px] bg-[#0CC0DF] text-white px-1.5 py-0.5 rounded-md font-semibold">
                                Selected
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-navy/70">{row.chest}</td>
                          <td className="py-2.5 px-3 text-navy/70">{row.length}</td>
                          <td className="py-2.5 px-4 text-right font-extrabold text-[#0CC0DF]">
                            ₱{rowPrice}.00
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-navy/60">
                <p>💡 Tip: Click any row to select that size immediately.</p>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-4 py-2 bg-[#0CC0DF] hover:bg-[#0aa6c2] text-white font-bold rounded-full transition-colors cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
