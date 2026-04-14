// Both EN and AR names are always returned — the component picks which to display.
export interface Country {
  geonameId: number;
  nameEn: string;
  nameAr: string;
  countryCode: string;
}

export interface State {
  geonameId: number;
  nameEn: string;
  nameAr: string;
}

export interface City {
  geonameId: number;
  nameEn: string;
  nameAr: string;
}
