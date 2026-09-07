// ─── Unified Data Store ──────────────────────────────────────────────────────
// Central access point for all product data with search, filter, and lookup

import type { Product, HardwareCategory, SearchResult } from "../types/common";
import { cpus } from "./cpus";
import { gpus } from "./gpus";
import { mice } from "./mice";
import { keyboards } from "./keyboards";
import { monitors } from "./monitors";
import { microphones } from "./microphones";

// Combine all products into a single array
const ALL_PRODUCTS: Product[] = [
  ...cpus,
  ...gpus,
  ...mice,
  ...keyboards,
  ...monitors,
  ...microphones,
];

/** Get all products */
export function getAllProducts(): Product[] {
  return ALL_PRODUCTS;
}

/** Get products by category */
export function getProductsByCategory(category: HardwareCategory): Product[] {
  return ALL_PRODUCTS.filter((p) => p.category === category);
}

/** Get a single product by ID */
export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

/** Get multiple products by IDs */
export function getProductsByIds(ids: string[]): Product[] {
  return ids.map((id) => ALL_PRODUCTS.find((p) => p.id === id)).filter(Boolean) as Product[];
}

/** Search products by name or brand */
export function searchProducts(query: string, limit = 20): SearchResult[] {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const product of ALL_PRODUCTS) {
    const nameMatch = product.name.toLowerCase().includes(lowerQuery);
    const brandMatch = product.brand.toLowerCase().includes(lowerQuery);
    const categoryMatch = product.category.toLowerCase().includes(lowerQuery);

    if (nameMatch || brandMatch || categoryMatch) {
      // Calculate match score (higher = better match)
      let score = 0;
      if (product.name.toLowerCase().startsWith(lowerQuery)) score += 100;
      if (nameMatch) score += 50;
      if (brandMatch) score += 30;
      if (categoryMatch) score += 10;

      results.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        msrp: product.msrp,
        matchScore: score,
      });
    }
  }

  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

/** Get available categories with product counts */
export function getCategoriesWithCounts(): { category: HardwareCategory; count: number }[] {
  const counts = new Map<HardwareCategory, number>();

  for (const product of ALL_PRODUCTS) {
    counts.set(product.category, (counts.get(product.category) || 0) + 1);
  }

  return Array.from(counts.entries()).map(([category, count]) => ({
    category,
    count,
  }));
}

/** Get featured products (top 2 per category) */
export function getFeaturedProducts(): Product[] {
  const categories = new Set(ALL_PRODUCTS.map((p) => p.category));
  const featured: Product[] = [];

  for (const cat of categories) {
    const products = ALL_PRODUCTS.filter((p) => p.category === cat);
    featured.push(...products.slice(0, 2));
  }

  return featured;
}
