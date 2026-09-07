"use client";

import Link from "next/link";
import { useCountry } from "../hooks/useCountry";
import { useCountriesByCodes } from "../hooks/useCountriesByCodes";
import Image from "next/image";


interface CountryDetailsProps {
  code: string;
}

export default function CountryDetails({
  code,
}: CountryDetailsProps) {
  const { data: country, isLoading, isError } = useCountry(code);
  const {
  data: borderCountries = [],
  isLoading: isBordersLoading,
} = useCountriesByCodes(country?.borders ?? []);


  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-sky-200 p-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-20 h-32 w-64 rounded-full bg-white/60 blur-xl" />
          <div className="absolute right-[-80px] top-32 h-40 w-72 rounded-full bg-white/60 blur-xl" />
          <div className="absolute bottom-[-20px] right-[-50px] h-48 w-96 rounded-full bg-white/45 blur-2xl" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
          <p className="text-lg font-medium text-sky-950">
            Exploring country...
          </p>
        </div>
      </main>
    );
  }

  if (isError || !country) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-sky-200 p-8">
        <div className="relative z-10 mx-auto max-w-5xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-sky-900 transition hover:text-sky-700"
          >
            ← Back to Atlas
          </Link>

          <div className="mt-20 rounded-3xl bg-white/80 p-10 text-center shadow-xl backdrop-blur-md">
            <h1 className="text-3xl font-bold text-sky-950">
              Country not found
            </h1>

            <p className="mt-3 text-zinc-500">
              We couldn't load the information for this country.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const nativeName =
    Object.values(country.names.native)[0]?.common ?? "N/A";

  const capital =
    country.capitals.length > 0
      ? country.capitals[0].name
      : "N/A";

  return (
    <main className="relative min-h-screen overflow-hidden bg-sky-200 p-6 sm:p-8">
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
        {/* Back */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-950 transition hover:-translate-x-1"
        >
          ← Back to Atlas
        </Link>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-sky-950 p-7 text-white shadow-2xl sm:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-700/40 blur-3xl" />

          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
            {/* Flag */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl sm:h-40 sm:w-60">
                {country.flag.url_svg ? (
                <Image
                 src={country.flag.url_svg}
                 alt={`${country.names.common} flag`}
                 width={240}
                 height={160}
                 className="h-full w-full object-cover"
                 />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                        No flag available
                </div>
              )}
            </div>

            {/* Country heading */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-widest text-sky-100">
                  {country.codes.alpha_3}
                </span>

                <span className="text-sm text-sky-200">
                  {country.region}
                </span>
              </div>

              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                {country.names.common}
              </h1>

              <p className="mt-3 text-sky-200">
                {nativeName}
              </p>
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <section className="relative -mt-8 mx-4 grid grid-cols-2 overflow-hidden rounded-2xl bg-white/95 shadow-xl backdrop-blur-md sm:grid-cols-4">
          <div className="border-b border-sky-100 p-5 sm:border-b-0 sm:border-r">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Population
            </p>
            <p className="mt-2 text-lg font-bold text-sky-950">
              {country.population.toLocaleString()}
            </p>
          </div>

          <div className="border-b border-sky-100 p-5 sm:border-b-0 sm:border-r">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Capital
            </p>
            <p className="mt-2 text-lg font-bold text-sky-950">
              {capital}
            </p>
          </div>

          <div className="border-r border-sky-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Subregion
            </p>
            <p className="mt-2 text-lg font-bold text-sky-950">
              {country.subregion || "N/A"}
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              TLD
            </p>
            <p className="mt-2 text-lg font-bold text-sky-950">
              {country.tlds.length > 0
                ? country.tlds.join(", ")
                : "N/A"}
            </p>
          </div>
        </section>

        {/* Details */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Currencies */}
          <section className="rounded-3xl bg-white/90 p-7 shadow-lg backdrop-blur-md">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                Economy
              </p>

              <h2 className="mt-1 text-2xl font-bold text-sky-950">
                Currencies
              </h2>
            </div>

            <div className="space-y-3">
              {country.currencies.length > 0 ? (
                country.currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between rounded-2xl bg-sky-50 px-5 py-4"
                  >
                    <div>
                      <p className="font-semibold text-zinc-900">
                        {currency.name}
                      </p>

                      <p className="mt-1 text-xs font-medium text-sky-600">
                        {currency.code}
                      </p>
                    </div>

                    <span className="text-2xl font-bold text-sky-900">
                      {currency.symbol}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">
                  No currency information available.
                </p>
              )}
            </div>
          </section>

          {/* Languages */}
          <section className="rounded-3xl bg-white/90 p-7 shadow-lg backdrop-blur-md">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                Culture
              </p>

              <h2 className="mt-1 text-2xl font-bold text-sky-950">
                Languages
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {country.languages.length > 0 ? (
                country.languages.map((language) => (
                  <span
                    key={language.name}
                    className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-900"
                  >
                    {language.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-zinc-500">
                  No language information available.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Borders */}
        <section className="mt-6 rounded-3xl bg-white/90 p-7 shadow-lg backdrop-blur-md">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
                Continue exploring
              </p>

              <h2 className="mt-1 text-2xl font-bold text-sky-950">
                Border Countries
              </h2>
            </div>

            <span className="text-sm text-zinc-400">
              {country.borders.length}{" "}
              {country.borders.length === 1
                ? "country"
                : "countries"}
            </span>
          </div>

             {isBordersLoading ? (
              <p className="text-sm text-zinc-500">
               Loading border countries...
    </p>
) : borderCountries.length > 0 ? (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {borderCountries.map((borderCountry) => (
      <Link
        key={borderCountry.codes.alpha_3}
        href={`/country/${borderCountry.codes.alpha_3}`}
        className="group flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-100 hover:shadow-md"
      >
        <span className="font-bold text-sky-950">
          {borderCountry.names.common}
        </span>

        <span className="text-sky-400 transition group-hover:translate-x-1">
          →
        </span>
      </Link>
    ))}
  </div>
) : (
  <p className="text-sm text-zinc-500">
    This country has no land borders.
  </p>
)} 
        </section>
      </div>
    </main>
  );
}