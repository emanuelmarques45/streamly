const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = {
  original: "https://image.tmdb.org/t/p/original",
  w92: "https://image.tmdb.org/t/p/w92",
  w300: "https://image.tmdb.org/t/p/w300",
  w342: "https://image.tmdb.org/t/p/w342",
};
const HEADERS = {
  accept: "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
};
const CARD_IMAGE_SIZES = `
  (max-width: 640px) 140px,
  (max-width: 768px) 160px,
  (max-width: 1024px) 180px,
  (max-width: 1280px) 200px,
  220px
`;

export { BASE_URL, IMAGE_BASE_URL, HEADERS, CARD_IMAGE_SIZES };
