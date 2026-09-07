import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/data/store";
import { calculateDiffs } from "@/lib/engine/diff-calculator";
import { generateRadarData, computeOverallScores } from "@/lib/engine/benchmark-normalizer";
import { checkCompatibility } from "@/lib/engine/compatibility-checker";
import type { HardwareCategory, ComparisonResult } from "@/lib/types/common";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json(
      { error: "Bad Request", message: "Missing 'ids' parameter", status: 400 },
      { status: 400 }
    );
  }

  const ids = idsParam.split(",").filter(Boolean);
  if (ids.length < 2) {
    return NextResponse.json(
      { error: "Bad Request", message: "At least 2 product IDs required", status: 400 },
      { status: 400 }
    );
  }

  const products = getProductsByIds(ids);
  if (products.length < 2) {
    return NextResponse.json(
      { error: "Not Found", message: "Could not find enough products", status: 404 },
      { status: 404 }
    );
  }

  const category = products[0].category as HardwareCategory;
  const fields = calculateDiffs(products, category);
  const radarData = generateRadarData(products, category);
  const overallScores = computeOverallScores(radarData);
  const compatibilityWarnings = checkCompatibility(products);

  const result: ComparisonResult = {
    category,
    products,
    fields,
    radarData,
    overallScores,
    compatibilityWarnings,
  };

  return NextResponse.json({ data: result });
}
