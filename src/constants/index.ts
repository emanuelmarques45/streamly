const BASE_URL = "https://api.themoviedb.org/3";

const IMAGE_BASE_URL = {
  original: "https://image.tmdb.org/t/p/original",
  w92: "https://image.tmdb.org/t/p/w92",
  w185: "https://image.tmdb.org/t/p/w185",
  w300: "https://image.tmdb.org/t/p/w300",
  w342: "https://image.tmdb.org/t/p/w342",
  w500: "https://image.tmdb.org/t/p/w500",
  w780: "https://image.tmdb.org/t/p/w780",
  w1280: "https://image.tmdb.org/t/p/w1280",
};

const CARD_IMAGE_SIZES = `
  (max-width: 640px) 140px,
  (max-width: 768px) 160px,
  (max-width: 1024px) 180px,
  (max-width: 1280px) 200px,
  220px
`;

/** Cache lifetime, in seconds, for TMDB responses. */
const REVALIDATE = {
  list: 60 * 60, // catalogs barely change during the day
  detail: 60 * 60 * 6, // a title's details rarely change
  search: 60 * 5, // search must pick up new titles faster
};

export { BASE_URL, IMAGE_BASE_URL, CARD_IMAGE_SIZES, REVALIDATE };
