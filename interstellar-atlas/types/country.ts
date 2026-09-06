export type Region =
  | "Africa"
  | "Americas"
  | "Asia"
  | "Europe"
  | "Oceania"
  | "Antarctic";

interface NativeName {
  common: string;
  official: string;
}

interface Capital {
  name: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface Language {
  name: string;
  native_name: string;
}

export interface Country {
  names: {
    common: string;
    native: Record<string, NativeName>;
  };

  flag: {
    url_svg: string;
  };

  population: number;

  codes: {
  alpha_3: string;
};

  region: Region;

  subregion: string;
  capitals: Capital[];
  tlds: string[];
  currencies: Currency[];
  languages: Language[];
  borders: string[];
}