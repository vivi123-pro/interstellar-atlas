"use client";

import Link from "next/link";
import { useReducer } from "react";
import type { Country, Region } from "@/types/country";
import { useQuery } from "@tanstack/react-query";
import { countriesQueryKey } from "@/lib/countries";
import { CountryApiError } from "@/lib/countries";  

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

function isRegion(value: string): value is Region {
  return regions.some((region) => region === value);
}

export default function CountryDashboard() {
  const fetchCountries = async (): Promise<Country[]> => {
    const response = await fetch("/api/countries");

  if (!response.ok) {
  throw new CountryApiError(
    "Failed to fetch countries",
    response.status
  );
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

const { search, selectedRegion, page } = state;

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-sky-200">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-20 h-32 w-64 rounded-full bg-white/60 blur-xl" />
          <div className="absolute left-32 top-12 h-24 w-48 rounded-full bg-white/50 blur-xl" />
          <div className="absolute right-[-80px] top-32 h-40 w-72 rounded-full bg-white/60 blur-xl" />
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <p className="text-lg font-semibold text-sky-950">
            Mapping the world...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-sky-200 p-8">
        <div className="relative z-10 mx-auto max-w-5xl pt-20 text-center">
          <div className="rounded-3xl bg-white/80 p-12 shadow-xl backdrop-blur-md">
            <h1 className="text-3xl font-bold text-sky-950">
              Something went wrong
            </h1>

            <p className="mt-3 text-zinc-500">
              We couldn't load the countries.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!countries) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-sky-200 p-8">
        <div className="relative z-10 mx-auto max-w-5xl pt-20 text-center">
          <p className="text-sky-950">
            No countries available.
          </p>
        </div>
      </main>
    );
  }

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.names.common
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRegion =
      selectedRegion === "" ||
      country.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  const totalPages = Math.ceil(
    filteredCountries.length / PAGE_SIZE
  );

  const startIndex = (page - 1) * PAGE_SIZE;

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
    payload: Math.max(page - 1, 1),
  });
};

const handleNextPage = () => {
  dispatch({
    type: "SET_PAGE",
    payload: Math.min(page + 1, totalPages),
  });
};

  return (
    <main className="relative min-h-screen overflow-hidden bg-sky-200 px-5 py-8 sm:px-8">
      {/* Clouds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-32 w-64 rounded-full bg-white/60 blur-xl" />

        <div className="absolute left-32 top-12 h-24 w-48 rounded-full bg-white/50 blur-xl" />

        <div className="absolute right-[-80px] top-32 h-40 w-72 rounded-full bg-white/60 blur-xl" />

        <div className="absolute right-32 top-8 h-24 w-48 rounded-full bg-white/45 blur-xl" />

        <div className="absolute bottom-20 left-[-100px] h-40 w-80 rounded-full bg-white/40 blur-2xl" />

        <div className="absolute bottom-[-20px] right-[-50px] h-48 w-96 rounded-full bg-white/45 blur-2xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Hero */}
        <header className="mb-10 pt-6 sm:pt-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-900 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-sky-600" />
            World Explorer
          </div>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-sky-950 sm:text-7xl">
            Interstellar
            <br />
            <span className="text-sky-700">Atlas</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-sky-900/70 sm:text-lg">
            Discover countries, explore their stories,
            and travel across the world from one place.
          </p>
        </header>

        {/* Search panel */}
        <section className="mb-8 rounded-3xl border border-white/70 bg-white/55 p-4 shadow-xl shadow-sky-900/5 backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-sky-500">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search for a country..."
                value={search}
                onChange={handleSearchChange}
                className="h-12 w-full rounded-2xl border border-sky-200 bg-white/85 pl-11 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              className="h-12 rounded-2xl border border-sky-200 bg-white/85 px-4 text-sm font-medium text-zinc-700 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 sm:min-w-44"
            >
              <option value="">All regions</option>

              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Results heading */}
        <div className="mb-4 flex items-end justify-between px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
              Destinations
            </p>

            <h2 className="mt-1 text-2xl font-bold text-sky-950">
              Explore countries
            </h2>
          </div>

          <p className="text-sm font-medium text-sky-800/60">
            {filteredCountries.length} found
          </p>
        </div>

        {/* Country cards */}
        <div className="space-y-3">
          {paginatedCountries.length > 0 ? (
            paginatedCountries.map((country) => (
              <Link
                key={country.names.common}
                href={`/country/${country.codes.alpha_3}`}
                className="group block"
              >
                <article className="flex items-center gap-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-md shadow-sky-900/5 backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl sm:gap-6 sm:p-5">
                  {/* Flag */}
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-sky-50 shadow-sm sm:h-16 sm:w-24">
                    {country.flag.url_svg ? (
                      <img
                        src={country.flag.url_svg}
                        alt={`${country.names.common} flag`}
                        className="h-full w-full object-cover"
                       />
                       ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-sky-400">
                         No flag
                           </div>
                          )}
                  </div>

                  {/* Country information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-lg font-bold text-zinc-900 transition group-hover:text-sky-700">
                        {country.names.common}
                      </h3>

                      <span className="hidden rounded-md bg-sky-100 px-2 py-1 text-[10px] font-bold tracking-wider text-sky-700 sm:inline">
                        {country.codes.alpha_3}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-sky-700">
                      {country.region}
                    </p>
                  </div>

                  {/* Population */}
                  <div className="hidden text-right sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Population
                    </p>

                    <p className="mt-1 text-sm font-semibold text-zinc-700">
                      {country.population.toLocaleString()}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 transition duration-200 group-hover:bg-sky-700 group-hover:text-white">
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-white/70 bg-white/70 p-14 text-center shadow-lg backdrop-blur-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-2xl">
                ?
              </div>

              <h3 className="text-lg font-bold text-sky-950">
                No countries found
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Try a different country name or region.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/70 bg-white/50 px-4 py-3 backdrop-blur-md sm:px-5">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="rounded-xl border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Page
              </p>

              <p className="mt-0.5 text-sm font-bold text-sky-950">
                {page}{" "}
                <span className="font-normal text-zinc-400">
                  / {totalPages}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="rounded-xl border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-950 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}