import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    showToast,
  } = useShop();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Slide panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl border-l border-navy/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-navy/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-royal/10 text-royal">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy font-montserrat">Your Cart</h3>
                  <p className="text-xs text-navy/50 font-medium">{cartCount} items</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 text-navy transition-colors hover:bg-navy hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy/5 text-navy/30 mb-4">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <h4 className="text-base font-bold text-navy font-montserrat">Your cart is empty</h4>
                  <p className="mt-1 text-xs text-navy/60 max-w-xs">
                    Browse our Modaline essentials and pick your favorite tee.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 rounded-full bg-[#0CC0DF] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0aa6c2] transition-colors"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-navy/10 bg-white p-3.5 shadow-sm transition-all hover:border-navy/20"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-navy/5 p-2 overflow-hidden flex">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-navy line-clamp-1">{item.name}</h5>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                            className="text-navy/40 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-navy/50 font-medium">
                          Color: {item.color.name} • Size: {item.size}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center rounded-full bg-navy/5 p-0.5 border border-navy/10">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-navy hover:bg-white transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-navy hover:bg-white transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-extrabold text-[#0CC0DF]">
                          ₱{(item.price * item.quantity).toLocaleString('en-PH')}.00
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-navy/10 bg-white p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-navy/70">Subtotal</span>
                  <span className="text-lg font-extrabold text-navy font-montserrat">
                    ₱{cartTotal.toLocaleString('en-PH')}.00
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-600 font-medium">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <button
                  onClick={() => {
                    showToast(`🎉 Order Placed! Thank you for purchasing ${cartCount} item(s)!`);
                    clearCart();
                    setIsCartOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0CC0DF] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0CC0DF]/30 hover:bg-[#0aa6c2] active:scale-[0.98] transition-all"
                >
                  Checkout Now
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
