export type CurrentWeather = {
  city: string;
  tempC: number;
  conditionMain: string;
  conditionDescription: string;
};

export type ForecastPoint = {
  dateTimeUtc: string; // ISO string
  tempC: number;
  conditionMain: string;
  conditionDescription: string;
};

export type ForecastResponse = {
  city: string;
  points: ForecastPoint[];
};
