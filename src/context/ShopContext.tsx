import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CartItem, ColorOption, ShopNotificationPayload } from '@/types/product';
import { getProductById, getPriceForSize } from '@/data/products';

interface ShopContextType {
  currentPath: string;
  selectedProductId: string;
  selectedColorIndex: number;
  navigate: (path: string, options?: { colorIndex?: number }) => void;
  cart: CartItem[];
  addToCart: (
    productId: string,
    color: ColorOption,
    size: string,
    quantity: number,
    options?: { triggerNotification?: boolean }
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  notification: ShopNotificationPayload | null;
  showNotification: (payload: Omit<ShopNotificationPayload, 'id'>) => void;
  dismissNotification: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('modaline_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('modaline_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<ShopNotificationPayload | null>(null);
  const notificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Persist cart changes
  useEffect(() => {
    try {
      localStorage.setItem('modaline_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Persist wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('modaline_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Handle popstate (browser back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, options?: { colorIndex?: number }) => {
    if (options?.colorIndex !== undefined) {
      setSelectedColorIndex(options.colorIndex);
    } else {
      setSelectedColorIndex(0);
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const showNotification = (payload: Omit<ShopNotificationPayload, 'id'>) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
    const newId = `${Date.now()}-${Math.random()}`;
    setNotification({ ...payload, id: newId });

    notificationTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const dismissNotification = () => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
    setNotification(null);
  };

  const addToCart = (
    productId: string,
    color: ColorOption,
    size: string,
    quantity: number,
    options?: { triggerNotification?: boolean }
  ) => {
    const product = getProductById(productId);
    const unitPrice = getPriceForSize(size, product.price);
    const cartItemId = `${productId}-${color.name}-${size}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          price: unitPrice,
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId,
            name: product.name,
            price: unitPrice,
            color,
            size,
            quantity,
            image: color.image,
          },
        ];
      }
    });

    if (options?.triggerNotification !== false) {
      showNotification({
        type: 'cart',
        productName: product.name,
        colorName: color.name,
        size,
        quantity,
        totalPrice: unitPrice * quantity,
      });
    }
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Removed item from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    const isSaved = wishlist.includes(productId);
    const product = getProductById(productId);
    if (isSaved) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast(`Removed ${product.name} from wishlist`);
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast(`❤️ Added ${product.name} to wishlist`);
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Extract selected product ID from currentPath if matches /product/:id
  let selectedProductId = 'essential-tee';
  if (currentPath.startsWith('/product/')) {
    const id = currentPath.replace('/product/', '').trim();
    if (id) {
      selectedProductId = id;
    }
  }

  return (
    <ShopContext.Provider
      value={{
        currentPath,
        selectedProductId,
        selectedColorIndex,
        navigate,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        toastMessage,
        showToast,
        notification,
        showNotification,
        dismissNotification,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

