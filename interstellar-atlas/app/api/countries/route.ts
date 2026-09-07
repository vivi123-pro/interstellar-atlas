import { NextResponse } from "next/server";
import { getCountries } from "@/lib/countries";

export async function GET() {
  try {
    const countries = await getCountries();

    return NextResponse.json(countries);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }
}