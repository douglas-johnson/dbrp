/// <reference types="vitest/config" />
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';

export default defineConfig({
  plugins: [hydrogen(), oxygen(), reactRouter()],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
    // browsers with light-dark() support
    cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5', 'ios17.5'],
  },
  ssr: {
    optimizeDeps: {
      include: ['sanitize-html', 'anchorme'],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
