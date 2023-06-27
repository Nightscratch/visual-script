import { defineConfig } from 'vite';
export default defineConfig({
    base: '/visual-script/',
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'vscript',
            fileName: (format) => `vscript.${format}.js`,
        }
    }
});