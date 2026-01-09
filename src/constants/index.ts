const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = {
  original: "https://image.tmdb.org/t/p/original",
  w92: "https://image.tmdb.org/t/p/w92",
  w342: "https://image.tmdb.org/t/p/w342",
};
const HEADERS = {
  accept: "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
};

export { BASE_URL, IMAGE_BASE_URL, HEADERS };
