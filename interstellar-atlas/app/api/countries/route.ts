import { NextResponse } from "next/server";
import {
  getCountries,
  CountryApiError,
} from "@/lib/countries";

export async function GET() {
  try {
    const countries = await getCountries();

    return NextResponse.json(countries);
  }  catch (error) {
    if (error instanceof CountryApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    );
  }}
  
