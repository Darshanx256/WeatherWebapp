// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Inject environment variables passed during build time into your application
    'process.env.VITE_OPENWEATHERMAP': JSON.stringify(process.env.VITE_OPENWEATHERMAP),
    'process.env.VITE_GEOAPIFY': JSON.stringify(process.env.VITE_GEOAPIFY),
    'process.env.VITE_DISTANCEMATRIX': JSON.stringify(process.env.VITE_DISTANCEMATRIX),
    'process.env.VITE_DISTANCEMATRIX_COORDS': JSON.stringify(process.env.VITE_DISTANCEMATRIX_COORDS),
    'process.env.VITE_VISUALCROSSING': JSON.stringify(process.env.VITE_VISUALCROSSING),
  },
});
