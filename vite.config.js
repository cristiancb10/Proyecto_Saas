import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

//POCKETBASE: Informatica_INF-460
// Se Agrega el componente de tailwindcss
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()]
})