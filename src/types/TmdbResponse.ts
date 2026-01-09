export type TmdbResponse<T> = {
  results: T[];
  page: number;
  total_pages: number;
};
