import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/data/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "15", 10);

  const results = searchProducts(query, limit);
  return NextResponse.json({ data: results });
}
