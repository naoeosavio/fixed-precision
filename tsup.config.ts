import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/FixedPrecision.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
  clean: true,
});
