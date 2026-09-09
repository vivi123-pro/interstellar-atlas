"use client";

import { useQuery } from "@tanstack/react-query";
import type { Country } from "@/types/country";
import { CountryApiError } from "@/lib/countries";

const countryQueryKey = (code: string) =>
  ["country", code] as const;

async function fetchCountry(code: string): Promise<Country> {
  const response = await fetch(`/api/countries/${code}`);

  if (!response.ok) {
    throw new CountryApiError(
      "Failed to fetch country",
      response.status
    );
  }

  return response.json();
}

export function useCountry(code: string) {
  return useQuery<Country>({
    queryKey: countryQueryKey(code),
    queryFn: () => fetchCountry(code),
    enabled: code.length > 0,
  });
}