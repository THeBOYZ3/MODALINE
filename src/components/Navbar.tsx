import React, { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { handleSmoothScroll } from '@/lib/lenis';
import { useShop } from '@/context/ShopContext';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Shop Basics', href: '#shop' },
  { label: 'Our Mission', href: '#mission' },
  { label: 'Contact', href: '#contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentPath, navigate, cartCount, setIsCartOpen } = useShop();

  const isProductPage = currentPath.startsWith('/product/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDarkText = scrolled || isProductPage;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    onAfter?: () => void
  ) => {
    e.preventDefault();
    if (isProductPage) {
      navigate('/');
      setTimeout(() => {
        handleSmoothScroll(e, href);
      }, 100);
    } else {
      handleSmoothScroll(e, href);
    }
    if (onAfter) onAfter();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isProductPage
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="group relative z-50 flex items-center"
        >
          <span
            className={`text-2xl font-extrabold tracking-tightest transition-colors duration-500 sm:text-[1.7rem] ${
              isDarkText ? 'text-navy' : 'text-white'
            }`}
          >
            Moda
            <span className={isDarkText ? 'text-royal' : 'text-royal-light'}>
              line
            </span>
          </span>
        </a>

        {/* Decorative background accents */}
        <div className="pointer-events-none absolute right-0 top-0 z-0 h-32 overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-royal/10" />
          <div className="absolute right-10 top-2 h-14 w-14 rounded-full bg-black/5" />
          <div className="absolute right-24 -top-4 h-10 w-10 rounded-full bg-royal-light/10" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`group relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    isDarkText
                      ? 'text-navy/70 hover:text-navy'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  <span
                    className={`absolute inset-0 scale-90 rounded-full opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 ${
                      isDarkText ? 'bg-royal/8' : 'bg-white/10'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Cart Icon (Desktop) */}
          <div className="styled-wrapper relative inline-flex items-center justify-center scale-[0.8] -my-2 -mx-1">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
              className={`button ${isDarkText ? 'dark-theme' : 'light-theme'}`}
            >
              <div className="button-box">
                <span className={`button-elem ${isDarkText ? 'text-navy' : 'text-white'}`}>
                  <ShoppingBag className="h-6 w-6 stroke-[2]" />
                </span>
                <span className="button-elem text-[#0CC0DF]">
                  <ShoppingBag className="h-6 w-6 stroke-[2]" />
                </span>
              </div>
            </button>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0CC0DF] text-[10px] font-extrabold text-white shadow-md animate-pulse pointer-events-none z-10">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <div className="styled-wrapper relative inline-flex items-center justify-center scale-[0.75] -my-2 -mx-1 z-50">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
              className={`button ${isDarkText ? 'dark-theme' : 'light-theme'}`}
            >
              <div className="button-box">
                <span className={`button-elem ${isDarkText ? 'text-navy' : 'text-white'}`}>
                  <ShoppingBag className="h-6 w-6 stroke-[2]" />
                </span>
                <span className="button-elem text-[#0CC0DF]">
                  <ShoppingBag className="h-6 w-6 stroke-[2]" />
                </span>
              </div>
            </button>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0CC0DF] text-[10px] font-extrabold text-white shadow-md pointer-events-none z-10">
                {cartCount}
              </span>
            )}
          </div>
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
            className={`relative z-50 rounded-full p-2 transition-colors ${
              isDarkText ? 'text-navy' : 'text-white'
            }`}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden bg-white transition-[max-height,opacity] duration-500 md:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, () => setMenuOpen(false))}
                className="block rounded-xl px-4 py-3 text-base font-medium text-navy/80 transition-colors hover:bg-royal/5 hover:text-royal"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
