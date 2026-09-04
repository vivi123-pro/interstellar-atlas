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

    const result: CountriesResponse = await response.json();

    allCountries.push(...result.data.objects);

    if (!result.data.meta.more) {
      break;
    }

    offset += limit;
  }

  return allCountries;
}