import React from "react";
import { HeroParallax, HeroParallaxProduct } from "./ui/hero-parallax";

// Modaline apparel dataset for HeroParallax
export const MODALINE_PRODUCTS: HeroParallaxProduct[] = [
  {
    title: "MODALINE SAPPHIRE ESSENTIAL",
    link: "#shop",
    thumbnail: "/images/products/Blue.png",
    category: "Signature Colorway",
    price: "₱299",
  },
  {
    title: "MODALINE CLASSIC WHITE",
    link: "#shop",
    thumbnail: "/images/products/white.png",
    category: "Minimal Collection",
    price: "₱299",
  },
  {
    title: "MODALINE LIFESTYLE RACK",
    link: "#collection",
    thumbnail: "/src/assets/images/modaline_lifestyle_rack_1785543645053.jpg",
    category: "Lookbook Studio",
    price: "Featured",
  },
  {
    title: "MODALINE ESSENTIAL BLACK",
    link: "#shop",
    thumbnail: "/images/products/black.png",
    category: "Everyday Wear",
    price: "₱299",
  },
  {
    title: "MODALINE NAVY EDITION",
    link: "#shop",
    thumbnail: "/images/products/navy_blue.png",
    category: "Heavyweight Series",
    price: "₱299",
  },
  {
    title: "MODALINE URBAN SHOWROOM",
    link: "#collection",
    thumbnail: "/src/assets/images/modaline_lifestyle_concrete_1785543659156.jpg",
    category: "Editorial Lookbook",
    price: "Featured",
  },
  {
    title: "MODALINE HEAVYWEIGHT BLACK",
    link: "#shop",
    thumbnail: "/images/products/black.png",
    category: "Oversized Fit (240 GSM)",
    price: "₱299",
  },
  {
    title: "MODALINE ROYAL BLUE TEE",
    link: "#shop",
    thumbnail: "/images/products/Blue.png",
    category: "Limited Series",
    price: "₱299",
  },
  {
    title: "MODALINE MINIMALIST CREW",
    link: "#shop",
    thumbnail: "/images/products/white.png",
    category: "Combed Cotton Blend",
    price: "₱299",
  },
  {
    title: "MODALINE MIDNIGHT NAVY",
    link: "#shop",
    thumbnail: "/images/products/navy_blue.png",
    category: "Everyday Fit",
    price: "₱299",
  },
  {
    title: "MODALINE PURE WHITE TEE",
    link: "#shop",
    thumbnail: "/images/products/white.png",
    category: "Pre-shrunk Jersey",
    price: "₱299",
  },
  {
    title: "MODALINE SAPPHIRE BLUE",
    link: "#shop",
    thumbnail: "/images/products/Blue.png",
    category: "Signature Blue (#1F80FF)",
    price: "₱299",
  },
  {
    title: "MODALINE STEALTH BLACK",
    link: "#shop",
    thumbnail: "/images/products/black.png",
    category: "Ultra-Soft Finish",
    price: "₱299",
  },
  {
    title: "MODALINE STUDIO COLLECTION",
    link: "#collection",
    thumbnail: "/src/assets/images/modaline_lifestyle_rack_1785543645053.jpg",
    category: "Lookbook Showcase",
    price: "New Arrival",
  },
  {
    title: "MODALINE DEEP NAVY",
    link: "#shop",
    thumbnail: "/images/products/navy_blue.png",
    category: "Tagless Comfort",
    price: "₱299",
  },
];

export function HeroParallaxSection() {
  return <HeroParallax products={MODALINE_PRODUCTS} />;
}

export default HeroParallaxSection;
