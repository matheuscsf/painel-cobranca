import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Configuração do Vite — https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Permite importar a partir de src/ com "@/", ex.: import App from "@/App"
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    port: 8443,
    strictPort: true,
    // Expõe o servidor na rede local para testar o painel no celular
    host: true,
    // Os CSVs de dados não são vigiados: no Windows, substituir esses arquivos com o servidor
    // rodando pode derrubá-lo (EBUSY). Os dados novos aparecem ao clicar em "Atualizar" no painel.
    watch: { ignored: ["**/public/data/**"] },
  },
  preview: {
    port: 8443,
    host: true,
  },
});
