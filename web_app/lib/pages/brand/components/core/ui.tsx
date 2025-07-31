import React from "react";
import { BrandStateInterface, FilterOptions } from "../../types/state";
import { Product } from "@/lib/pages/brand/types";

// Component State Extraction
export function getComponentStates(state: BrandStateInterface) {
  return {
    header_state: {
      brand: state.brand!,
    },
    products_state: {
      products: filterProducts(state.products, state.filters),
      filters: state.filters,
      isLoading: state.isLoading,
    },
    providers_state: {
      providers: state.providers,
      isLoading: state.isLoading,
    },
    gallery_state: {
      items: state.products.filter(p => p.beforeImagePrimary && p.afterImagePrimary),
      isLoading: state.isLoading,
    },
    training_state: {
      programs: state.trainingPrograms,
      isLoading: state.isLoading,
    },
    reviews_state: {
      reviews: state.reviews,
      isLoading: state.isLoading,
    },
  };
}

// Product Filtering Logic
export function filterProducts(products: Product[], filters: FilterOptions): Product[] {
  return products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.skinType && !product.skinType?.includes(filters.skinType)) return false;
    if (filters.spotlightOnly && !product.isSpotlight) return false;
    if (filters.inStockOnly && !product.inStock) return false;
    if (filters.priceRange) {
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }
    }
    return true;
  });
}

// Styling Utilities
export function getCertificationBadgeClass(level: string) {
  const classes: Record<string, string> = {
    platinum: "bg-gray-800 text-white",
    gold: "bg-yellow-500 text-white",
    silver: "bg-gray-400 text-white",
    bronze: "bg-orange-600 text-white",
  };
  return `px-3 py-1 rounded-full text-xs font-semibold ${classes[level] || classes.bronze}`;
}

export function getTabClass(isActive: boolean) {
  return isActive
    ? "px-6 py-3 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600"
    : "px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors";
}

export function getProductCardClass(isSpotlight: boolean, inStock: boolean) {
  let baseClass = "bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md";
  if (isSpotlight) baseClass += " ring-2 ring-indigo-500";
  if (!inStock) baseClass += " opacity-75";
  return baseClass;
}

export function getPriceClass(hasDiscount: boolean) {
  return hasDiscount
    ? "text-lg font-bold text-red-600"
    : "text-lg font-bold text-gray-900";
}

// Note: getRatingStars has been moved to @/lib/components/ui/RatingStars component

export function getLevelBadgeClass(level: string) {
  const classes: Record<string, string> = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-purple-100 text-purple-800",
  };
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes[level] || classes.beginner}`;
}

export function getTrainingCardColorClass(level: string) {
  const classes: Record<string, string> = {
    beginner: "bg-teal-600",
    intermediate: "bg-blue-600",
    advanced: "bg-purple-600",
  };
  return classes[level] || classes.beginner;
}

// Note: Reusable components have been moved to @/lib/components/ui/
// Import them using: import { LoadingSpinner, EmptyState, SpotlightBadge, OutOfStockOverlay, VerifiedBadge } from '@/lib/components/ui';

import { SocialIconProps } from "../../types/core";

export function SocialIcon({ platform }: SocialIconProps) {
  const icons: Record<string, string> = {
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z",
    facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    twitter: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
    youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    tiktok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
  };
  
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d={icons[platform] || ""} />
    </svg>
  );
}