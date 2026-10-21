import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const rootEnvDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export default defineConfig(({ mode }) => {
  const { PORT = '3000' } = loadEnv(mode, rootEnvDirectory, '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    server: {
      proxy: {
        // The API and Vite share the root .env configuration.
        '/api': {
          target: `http://127.0.0.1:${PORT}`,
          changeOrigin: true,
        },
      },
    },
  }
})
