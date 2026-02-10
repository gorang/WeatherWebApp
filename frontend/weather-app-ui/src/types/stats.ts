export type SearchHistoryItem = {
  id: number;
  city: string;
  searchedAtUtc: string;
  conditionMain: string;
  conditionDescription: string;
  tempC: number;
};

export type TopCity = { city: string; count: number };
export type LatestSearch = { city: string; searchedAtUtc: string; conditionMain: string; tempC: number };
export type ConditionDistribution = { conditionMain: string; count: number };

export type SearchStatistics = {
  topCities: TopCity[];
  latestSearches: LatestSearch[];
  conditionDistribution: ConditionDistribution[];
};
