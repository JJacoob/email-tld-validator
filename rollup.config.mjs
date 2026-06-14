import json from '@rollup/plugin-json';

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true,
    },
    plugins: [json()],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [json()],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.native.js',
      format: 'es',
      sourcemap: false,
    },
    plugins: [json()],
  },
];
