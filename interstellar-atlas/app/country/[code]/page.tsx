import CountryDetails from "../../components/CountryDetails";

interface CountryPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function CountryPage({
  params,
}: CountryPageProps) {
  const { code } = await params;

  return <CountryDetails code={code} />;
}