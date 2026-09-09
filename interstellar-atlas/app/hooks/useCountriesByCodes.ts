"use client";

import { useQuery } from "@tanstack/react-query";
import type { Country } from "@/types/country";
import { countriesQueryKey } from "@/lib/countries";

async function fetchCountries(): Promise<Country[]> {
  const response = await fetch("/api/countries");

  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }

  return response.json();
}

export function useCountriesByCodes(codes: string[]) {
  return useQuery<Country[]>({
    queryKey: [...countriesQueryKey, "by-codes", ...codes],
    queryFn: fetchCountries,
    enabled: codes.length > 0,
    select: (countries) =>
      countries.filter((country) =>
        codes.includes(country.codes.alpha_3)
      ),
  });
}