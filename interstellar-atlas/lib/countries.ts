import {
  isRegion,
  type Country,
} from "../types/country";

const API_URL = "https://api.restcountries.com/countries/v5";
const API_KEY = process.env.REST_COUNTRIES_API_KEY;

export class CountryApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "CountryApiError";
  }
}

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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function isCountry(value: unknown): value is Country {
  if (!isObject(value)) {
    return false;
  }

  if (!isObject(value.names)) {
    return false;
  }

  if (
    typeof value.names.common !== "string" ||
    !isObject(value.names.native)
  ) {
    return false;
  }

  for (const nativeName of Object.values(value.names.native)) {
    if (
      !isObject(nativeName) ||
      typeof nativeName.common !== "string" ||
      typeof nativeName.official !== "string"
    ) {
      return false;
    }
  }

  if (!isObject(value.flag)) {
    return false;
  }

  if (typeof value.flag.url_svg !== "string") {
    return false;
  }

  if (typeof value.population !== "number") {
    return false;
  }

  if (!isObject(value.codes)) {
    return false;
  }

  if (typeof value.codes.alpha_3 !== "string") {
    return false;
  }

  if (
    typeof value.region !== "string" ||
    !isRegion(value.region)
  ) {
    return false;
  }

  if (typeof value.subregion !== "string") {
    return false;
  }

  if (!Array.isArray(value.capitals)) {
    return false;
  }

  for (const capital of value.capitals) {
    if (
      !isObject(capital) ||
      typeof capital.name !== "string"
    ) {
      return false;
    }
  }

  if (!Array.isArray(value.tlds)) {
    return false;
  }

  if (
    !value.tlds.every(
      (tld): tld is string => typeof tld === "string"
    )
  ) {
    return false;
  }

  if (!Array.isArray(value.currencies)) {
    return false;
  }

  for (const currency of value.currencies) {
    if (
      !isObject(currency) ||
      typeof currency.code !== "string" ||
      typeof currency.name !== "string" ||
      typeof currency.symbol !== "string"
    ) {
      return false;
    }
  }

  if (!Array.isArray(value.languages)) {
    return false;
  }

  for (const language of value.languages) {
    if (
      !isObject(language) ||
      typeof language.name !== "string" ||
      typeof language.native_name !== "string"
    ) {
      return false;
    }
  }

  if (!Array.isArray(value.borders)) {
    return false;
  }

  if (
    !value.borders.every(
      (border): border is string => typeof border === "string"
    )
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

    if (!response.ok) {
  throw new CountryApiError(
    "Failed to fetch countries",
    response.status
  );
}

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

export async function getCountryByCode(code: string) {
  const countries = await getCountries();

  const country = countries.find(
    (country) =>
      country.codes.alpha_3.toUpperCase() === code.toUpperCase()
  );

  if (!country) {
  throw new CountryApiError(
    "Country not found",
    404
  );
}

  return country;
}