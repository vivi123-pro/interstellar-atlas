import { NextResponse } from "next/server";
import { getCountryByCode } from "@/lib/countries";

interface CountryRouteContext {
  params: Promise<{
    code: string;
  }>;
}

export async function GET(
  request: Request,
  context: CountryRouteContext
) {
  const { code } = await context.params;

  try {
    const country = await getCountryByCode(code);

    return NextResponse.json(country);
  } catch (error) {
    console.error("COUNTRY API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch country" },
      { status: 500 }
    );
  }
}