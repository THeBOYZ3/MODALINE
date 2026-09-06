import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export const ShopNotification: React.FC = () => {
  const { notification, dismissNotification } = useShop();

  return (
    <AnimatePresence mode="wait">
      {notification && (
        <motion.div
          key={notification.id}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] backdrop-blur-md font-montserrat"
        >
          <div className="flex items-start gap-3">
            {/* Modaline Blue Checkmark Icon Badge */}
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0CC0DF] text-white shadow-sm mt-0.5">
              <Check className="h-4 w-4 stroke-[2.5]" />
            </div>

            {/* Notification Body */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#0CC0DF]">
                  {notification.type === 'order' ? 'ORDER CONFIRMED' : 'ADDED TO CART'}
                </span>
              </div>

              <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
                {notification.productName}
              </p>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {notification.colorName} · Size {notification.size} · Qty {notification.quantity}
              </p>
            </div>

            {/* Right column: Price & Dismiss */}
            <div className="flex flex-col items-end justify-between shrink-0 self-stretch">
              <button
                onClick={dismissNotification}
                aria-label="Close notification"
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 -mr-1 -mt-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                ₱{notification.totalPrice.toLocaleString('en-PH')}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
