import { getCountries } from "@/lib/countries";

export default async function Home() {
  const countries = await getCountries();

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">
          Interstellar Atlas
        </h1>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <ul className="divide-y divide-zinc-200">
            {countries.map((country) => (
              <li
                key={country.names.common}
                className="flex items-center justify-between p-5"
              >
                <div className="flex items-center gap-4">
                  <img src={country.flag.url_svg}
                  alt={`${country.names.common} flag`}
                   className="h-6 w-9 object-cover"
                  />

                  <div>
                    <h2 className="font-semibold text-zinc-900">
                      {country.names.common}
                    </h2>
                    <p className="text-sm text-zinc-500">
                      {country.region}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-zinc-600">
                  Population: {country.population.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}