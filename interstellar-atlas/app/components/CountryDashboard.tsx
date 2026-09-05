"use client";

import { useState } from "react";
import type { Country, Region } from "@/types/country";
import { useQuery } from "@tanstack/react-query";


const regions: Region[] = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
];

const PAGE_SIZE = 10;

function isRegion(value: string): value is Region {
  return regions.some((region) => region === value);
}


export default function CountryDashboard() {  

  const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch("/api/countries");

  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }

  return response.json();
};

  const { data: countries, isLoading, isError } = useQuery<Country[]>({
  queryKey: ["countries"],
  queryFn: fetchCountries,
});
  
  const [search, setSearch] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<Region | "">("");
  const [page, setPage] = useState<number>(1);

  if (isLoading) {
  return <p>Loading...</p>;
}

if (isError) {
  return <p>Something went wrong.</p>;
}

if (!countries) {
  return <p>No countries available.</p>;
}

  // Search + region filter
  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.names.common
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesRegion =
      selectedRegion === "" || country.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCountries.length / PAGE_SIZE);

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedCountries = filteredCountries.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleRegionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;

    if (value === "") {
      setSelectedRegion("");
    } else if (isRegion(value)) {
      setSelectedRegion(value);
    }

    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((currentPage) =>
      Math.min(currentPage + 1, totalPages)
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-sky-200 p-8">
      {/* Clouds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-32 w-64 rounded-full bg-white/60 blur-xl" />
        <div className="absolute left-32 top-12 h-24 w-48 rounded-full bg-white/50 blur-xl" />
        <div className="absolute right-[-80px] top-32 h-40 w-72 rounded-full bg-white/60 blur-xl" />
        <div className="absolute right-32 top-8 h-24 w-48 rounded-full bg-white/45 blur-xl" />
        <div className="absolute bottom-20 left-[-100px] h-40 w-80 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute bottom-[-20px] right-[-50px] h-48 w-96 rounded-full bg-white/45 blur-2xl" />
      </div>

      {/* Dashboard */}
      <div className="relative z-10 mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-sky-950">
          Interstellar Atlas
        </h1>

        {/* Search + Region Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search for a country..."
            value={search}
            onChange={handleSearchChange}
            className="flex-1 rounded-lg border border-sky-300 bg-white/90 px-4 py-3 text-sm text-black shadow-sm outline-none backdrop-blur-sm focus:border-sky-500"
          />

          <select
            value={selectedRegion}
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

        {/* Country List */}
        <div className="overflow-hidden rounded-xl bg-white/95 shadow-lg backdrop-blur-sm">
          {paginatedCountries.length > 0 ? (
            <ul className="divide-y divide-sky-100">
              {paginatedCountries.map((country) => (
                <li
                  key={country.names.common}
                  className="flex items-center justify-between p-5 transition hover:bg-sky-50"
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
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-10 text-center text-sm text-zinc-500">
              No countries found.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="rounded-lg border border-sky-300 bg-white/90 px-4 py-2 text-sm font-medium text-sky-950 shadow-sm backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-medium text-sky-950">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={page === totalPages}
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

