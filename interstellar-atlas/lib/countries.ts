import type { Country } from "../types/country";

const API_URL = "https://api.restcountries.com/countries/v5";
const API_KEY = process.env.REST_COUNTRIES_API_KEY;


interface CountriesResponse {
  data: {
    objects: Country[];
    meta: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}

function isCountry(value: unknown): value is Country {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("names" in value) || !("flag" in value)) {
    return false;
  }

  if (
    typeof value.names !== "object" ||
    value.names === null ||
    !("common" in value.names) ||
    typeof value.names.common !== "string"
  ) {
    return false;
  }

  if (
    typeof value.flag !== "object" ||
    value.flag === null ||
    !("url_svg" in value.flag) ||
    typeof value.flag.url_svg !== "string"
  ) {
    return false;
  }

  if (
  !("population" in value) ||
  typeof value.population !== "number"
) {
  return false;
}

if (
  !("region" in value) ||
  typeof value.region !== "string"
) {
  return false;
}

  return true;
}



function isCountriesResponse(value: unknown): value is CountriesResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("data" in value)) {
    return false;
  }

  const data = value.data;

  if (typeof data !== "object" || data === null) {
    return false;
  }

  if (!("objects" in data) || !("meta" in data)) {
    return false;
  }

  if (!Array.isArray(data.objects)) {
    return false;
  }

  if (!data.objects.every(isCountry)) {
    return false;
  }

  return true;
}

export const countriesQueryKey = ["countries"] as const;

export async function getCountries() {
  const allCountries: Country[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await fetch(
      `${API_URL}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const result: unknown = await response.json();

    if (!isCountriesResponse(result)) {
      throw new Error("Invalid countries response");
      }

    allCountries.push(...result.data.objects);

    if (!result.data.meta.more) {
      break;
    }

    offset += limit;
  }

  return allCountries;
}

