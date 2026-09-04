import type { Country } from "../types/country";

const API_URL = "https://api.restcountries.com/countries/v5";
const API_KEY = process.env.REST_COUNTRIES_API_KEY;

interface CountriesResponse {
  data: {
    objects: Country[];
  };
} 

export async function getCountries() {
    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
    });

    const result: CountriesResponse = await response.json();

    return result.data.objects
}