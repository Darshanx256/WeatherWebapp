import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Set the root directory explicitly
  define: {
    'process.env.VITE_OPENWEATHERMAP': JSON.stringify(process.env.VITE_OPENWEATHERMAP),
    'process.env.VITE_GEOAPIFY': JSON.stringify(process.env.VITE_GEOAPIFY),
    'process.env.VITE_DISTANCEMATRIX': JSON.stringify(process.env.VITE_DISTANCEMATRIX),
    'process.env.VITE_DISTANCEMATRIX_COORDS': JSON.stringify(process.env.VITE_DISTANCEMATRIX_COORDS),
    'process.env.VITE_VISUALCROSSING': JSON.stringify(process.env.VITE_VISUALCROSSING),
  },
  build: {
    outDir: '.', // Output to the root directory
    emptyOutDir: false, // Prevent clearing the root folder
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]', // Prevent hashed names for CSS/JS
        entryFileNames: '[name].js', // Prevent hashed names for entry files
      },
    },
  },
  server: {
    fs: {
      allow: ['.'], // Allow serving from the root folder
    },
  },
  base: './', // Ensure assets are linked relative to the HTML
});