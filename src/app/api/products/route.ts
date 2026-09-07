import { NextResponse } from "next/server";
import { getAllProducts, getProductsByCategory, searchProducts } from "@/lib/data/store";
import type { HardwareCategory } from "@/lib/types/common";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as HardwareCategory | null;
  const query = searchParams.get("q");

  if (query) {
    const results = searchProducts(query);
    return NextResponse.json({ data: results });
  }

  if (category) {
    const products = getProductsByCategory(category);
    return NextResponse.json({ data: products });
  }

  const products = getAllProducts();
  return NextResponse.json({ data: products });
}
