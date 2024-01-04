import { defineConfig, } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
// import {  esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { dependencies } from './package.json';

function renderChunks(deps: Record<string, string>) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  publicDir:"./public",
  server: {
    port: 3000
  },
  build: {
    outDir: './build',
    emptyOutDir: true,
    // sourcemap: false,
    rollupOptions: {
        // manualChunks: {
        //   vendor: ['react', 'react-router-dom', 'react-dom', 'theme-ui-next'],
        //   ...renderChunks(dependencies),
        // },
    },
    // polyfillModulePreload: true
  },
  // root:'./index.html',
  resolve: {
    // alias:{
    //   'src' : path.resolve(__dirname, './src'),
    //   'graphql/graphs' : path.resolve(__dirname, './src/graphql/graphs'),
    //   'graphql/create' : path.resolve(__dirname, './src/graphql/create'),
    //   'graphql/contentBuilder' : path.resolve(__dirname, './src/graphql/contentBuilder'),
    //   'graphql/list' : path.resolve(__dirname, './src/graphql/list'),
    //   'graphql/reorder' : path.resolve(__dirname, './src/graphql/reorder'),
    //   'graphql/settings' : path.resolve(__dirname, './src/graphql/settings'),
    //   'graphql/modules' : path.resolve(__dirname, './src/graphql/modules'),
    //   'graphql/cache' : path.resolve(__dirname, './src/graphql/cache'),
    //   'graphql/apolloClient' : path.resolve(__dirname, './src/graphql/apolloClient'),
    //   'graphql/categories' : path.resolve(__dirname, './src/graphql/categories'),
    //   'graphql/reports' : path.resolve(__dirname, './src/graphql/reports'),
    //   'graphql/saasOptics' : path.resolve(__dirname, './src/graphql/saasOptics'),
    //   'graphql/products': path.resolve(__dirname, './src/graphql/products'),
    //   'bundles' : path.resolve(__dirname, './src/bundles'),
    //   'components' : path.resolve(__dirname, './src/components'),
    //   'pages' : path.resolve(__dirname, './src/pages'),
    //   'res' : path.resolve(__dirname, './src/res'),
    //   'ui-web' : path.resolve(__dirname, './src/ui-web'),

    //   // On production build, components repo will have different theme ui version 
    //   'theme-ui-next': path.resolve(__dirname,'node_modules/theme-ui-next'),
    //   'theme-ui': path.resolve(__dirname,'node_modules/theme-ui'),
    //   'react-i18next': path.resolve(__dirname, 'node_modules/react-i18next')

    // },
  },
  optimizeDeps: {
    // include: ['prop-types'],
    esbuildOptions:{
      plugins:[
        // esbuildCommonjs(['react-calendar','react-date-picker']) 
      ]
    },
    include: [
            '@apollo/client/core',
            '@apollo/client/cache',
    ],
  },
  plugins: [
    // splitVendorChunkPlugin(),
    viteCommonjs(),
    react(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
        // ...svgr options (https://react-svgr.com/docs/options/)
      },
    }),
     visualizer(),
  ],
})
