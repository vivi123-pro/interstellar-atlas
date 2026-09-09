# Interstellar Atlas

A country exploration dashboard built with **Next.js, TypeScript, and React Query**, powered by the REST Countries API.

The application lets users search and filter countries, paginate through results, and open detailed country pages with information about currencies, languages, capitals, and neighboring countries.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API key

Create a `.env` file in the project root:

```env
REST_COUNTRIES_API_KEY=your_api_key_here
```

The API key is kept on the server and is not exposed to the client.

Make sure `.env` is included in `.gitignore` and never commit your API key.

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Check TypeScript

```bash
npx tsc --noEmit
```

The project uses TypeScript strict mode and aims to maintain zero `any` types.

## Architecture

### Server State — React Query

React Query manages data fetched from the REST Countries API.

The client communicates with internal Next.js API routes rather than exposing the API key directly to the browser.

```text
Client → Next.js API Route → REST Countries API
```

React Query handles fetching, caching, loading, and error states.

### API Response Validation

External API responses are treated as `unknown` before being used.

Custom type guards validate and narrow the response into the application's `Country` type.

This prevents unvalidated external data from flowing directly into the UI.

### Client State — useReducer

The dashboard uses a typed `useReducer` for related UI state:

* Search
* Selected region
* Current page

A discriminated union defines the available actions, making state transitions explicit and type-safe.

For example, changing the search or region also resets pagination to the first page.

### Why Not Redux or Zustand?

A third-party state manager would be unnecessary for this application.

The client-side state is small and local to the dashboard, while server state is already handled by React Query. Context API would also add unnecessary complexity because this state does not need to be shared throughout the application.

If the application grew to require shared client state across many unrelated components, a state-management solution could be reconsidered.

## TypeScript Decisions

The project uses:

* Interfaces for structured application data such as `Country`
* Literal union types for valid regions
* Generics with React Query
* `unknown` at external data boundaries
* Custom type guards for runtime validation
* Discriminated unions for reducer actions
* Strict TypeScript configuration

The goal is to let TypeScript catch incorrect assumptions rather than bypassing the compiler with `any` or unnecessary type assertions.

## Project Structure

```text
app/
├── api/
│   └── countries/
├── components/
│   ├── CountryDashboard.tsx
│   └── CountryDetails.tsx
├── country/
│   └── [code]/
│       └── page.tsx
├── hooks/
│   └── useCountry.ts
├── layout.tsx
└── providers.tsx

lib/
└── countries.ts

types/
└── country.ts
```

## Technologies

* Next.js
* TypeScript
* React
* React Query
* Tailwind CSS
* REST Countries API
* Git & GitHub
