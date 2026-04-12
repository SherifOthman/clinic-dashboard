/// Single-language location types — name is already in the requested language.
export interface Country {
  geonameId: number;
  name: string;
  countryCode: string;
}

export interface State {
  geonameId: number;
  name: string;
}

export interface City {
  geonameId: number;
  name: string;
}
