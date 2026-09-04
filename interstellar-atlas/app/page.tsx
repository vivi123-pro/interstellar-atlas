import { getCountries} from "@/lib/countries";
import CountryDashboard from "./components/CountryDashboard";

export default async function Home() {
  const countries = await getCountries();

  return <CountryDashboard countries={countries}/>
}