import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    return {
      // dev specific config
    }
  } else {
    // command === 'build'
    return {
      publicDir: false,
      build: {
        rollupOptions: {
          input: 'src/entry.mjs',
          output: {
            entryFileNames: 'index.js',
            format: 'esm',
            manualChunks(id) {
              if (id.includes('node_modules')) {
                return 'vendor'
              }
            },
          }
        }
      }
    }
  }
})