import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// שנה את השורה "base" בהתאם לשם הריפוזיטורי שלך ב-GitHub
export default defineConfig({
  base: '/SwissRouteApp/',
  plugins: [react()]
});
