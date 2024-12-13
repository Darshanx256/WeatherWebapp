// config.mjs
console.log(import.meta.env);  // This will print out all the environment variables
export const OPENWEATHERMAP_KEY = import.meta.env.VITE_OPENWEATHERMAP;
export const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY;
