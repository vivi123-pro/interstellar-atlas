"use client";

import Link from "next/link";
import { useReducer } from "react";
import { isRegion, type Country, type Region } from "@/types/country";
import { useQuery } from "@tanstack/react-query";
import { countriesQueryKey } from "@/lib/countries";

const regions: Region[] = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
];

const PAGE_SIZE = 10;

interface DashboardState {
  search: string;
  selectedRegion: Region | "";
  page: number;
}

type DashboardAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_REGION"; payload: Region | "" }
  | { type: "SET_PAGE"; payload: number };

function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
        page: 1,
      };

    case "SET_REGION":
      return {
        ...state,
        selectedRegion: action.payload,
        page: 1,
      };

    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}

export default function CountryDashboard() {
  const fetchCountries = async (): Promise<Country[]> => {
    const response = await fetch("/api/countries");

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    return response.json();
  };

  const {
    data: countries,
    isLoading,
    isError,
  } = useQuery<Country[]>({
    queryKey: countriesQueryKey,
    queryFn: fetchCountries,
  });

  const [state, dispatch] = useReducer(dashboardReducer, {
    search: "",
    selectedRegion: "",
    page: 1,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong.</p>;
  }

  if (!countries) {
    return <p>No countries available.</p>;
  }

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.names.common
      .toLowerCase()
      .includes(state.search.toLowerCase());

    const matchesRegion =
      state.selectedRegion === "" ||
      country.region === state.selectedRegion;

    return matchesSearch && matchesRegion;
  });

  const totalPages = Math.ceil(filteredCountries.length / PAGE_SIZE);

  const startIndex = (state.page - 1) * PAGE_SIZE;

  const paginatedCountries = filteredCountries.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: "SET_SEARCH",
      payload: event.target.value,
    });
  };

  const handleRegionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;

    if (value === "") {
      dispatch({
        type: "SET_REGION",
        payload: "",
      });
    } else if (isRegion(value)) {
      dispatch({
        type: "SET_REGION",
        payload: value,
      });
    }
  };

  const handlePreviousPage = () => {
    dispatch({
      type: "SET_PAGE",
      payload: Math.max(state.page - 1, 1),
    });
  };

  const handleNextPage = () => {
    dispatch({
      type: "SET_PAGE",
      payload: Math.min(state.page + 1, totalPages),
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-sky-200 p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-32 w-64 rounded-full bg-white/60 blur-xl" />
        <div className="absolute left-32 top-12 h-24 w-48 rounded-full bg-white/50 blur-xl" />
        <div className="absolute right-[-80px] top-32 h-40 w-72 rounded-full bg-white/60 blur-xl" />
        <div className="absolute right-32 top-8 h-24 w-48 rounded-full bg-white/45 blur-xl" />
        <div className="absolute bottom-20 left-[-100px] h-40 w-80 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute bottom-[-20px] right-[-50px] h-48 w-96 rounded-full bg-white/45 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-sky-950">
          Interstellar Atlas
        </h1>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search for a country..."
            value={state.search}
            onChange={handleSearchChange}
            className="flex-1 rounded-lg border border-sky-300 bg-white/90 px-4 py-3 text-sm text-black shadow-sm outline-none backdrop-blur-sm focus:border-sky-500"
          />

          <select
            value={state.selectedRegion}
            onChange={handleRegionChange}
            className="rounded-lg border border-sky-300 bg-white/90 px-4 py-3 text-sm text-black shadow-sm outline-none backdrop-blur-sm focus:border-sky-500"
          >
            <option value="">All regions</option>

            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl bg-white/95 shadow-lg backdrop-blur-sm">
          {paginatedCountries.length > 0 ? (
            <ul className="divide-y divide-sky-100">
              {paginatedCountries.map((country) => (
                <li
                  key={country.names.common}
                  className="flex items-center justify-between p-5 transition hover:bg-sky-50"
                >
                  <Link
                    href={`/country/${country.codes.alpha_3}`}
                    className="flex flex-1 items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {country.flag.url_svg && (
                        <img
                          src={country.flag.url_svg}
                          alt={`${country.names.common} flag`}
                          className="h-6 w-9 object-cover"
                        />
                      )}

                      <div>
                        <h2 className="font-semibold text-zinc-900">
                          {country.names.common}
                        </h2>

                        <p className="text-sm text-sky-700">
                          {country.region}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-600">
                      Population:{" "}
                      {country.population.toLocaleString()}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-10 text-center text-sm text-zinc-500">
              No countries found.
            </div>
          )}
        </div>

        {totalPages > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={state.page === 1}
              className="rounded-lg border border-sky-300 bg-white/90 px-4 py-2 text-sm font-medium text-sky-950 shadow-sm backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-sky-950">
              Page {state.page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={state.page === totalPages}
              className="rounded-lg border border-sky-300 bg-white/90 px-4 py-2 text-sm font-medium text-sky-950 shadow-sm backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}