import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig({
  plugins: [reactRouter()],
  
  // Define environment constants accessible via import.meta.env
  define: {
    'import.meta.env.VITE_ORG_LOGO': JSON.stringify('/logo.svg'),
    'import.meta.env.VITE_ORG_NAME': JSON.stringify('RG-VP Web Solutions'),
    'import.meta.env.VITE_EMAIL_SUPPORT': JSON.stringify('support@rgvp.in'),
    'import.meta.env.VITE_EMAIL_SALES': JSON.stringify('sales@rgvp.in'),
    'import.meta.env.VITE_PHONE_SALES': JSON.stringify('+91-XXXXXXXXXX'),
    'import.meta.env.VITE_PHONE_SUPPORT': JSON.stringify('+91-XXXXXXXXXX'),
    'import.meta.env.VITE_ADDRESS': JSON.stringify('India'),
    'import.meta.env.VITE_DEV_ORG_NAME': JSON.stringify('RG-VP Web Solutions'),
    'import.meta.env.VITE_DEV_APP_NAME': JSON.stringify('RGVP Core – Node Edition'),
    'import.meta.env.VITE_DEV_APP_VERSION': JSON.stringify('v1.1.0'),
    'import.meta.env.VITE_SOCIAL_MEDIA_LINK': JSON.stringify('https://rgvp.in'),
    'import.meta.env.VITE_URL_APP_API': JSON.stringify('https://apis.one.rgvp.in'),
    'import.meta.env.VITE_URL_APP': JSON.stringify('https://one.rgvp.in'),
    'import.meta.env.VITE_URL_UPLOADS': JSON.stringify('https://data.one.rgvp.in/uploads'),
  },

  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },

  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
  },

  css: {
    postcss: './postcss.config.js',
  },
});