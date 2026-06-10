import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import plugin from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const target = env.NODE_BACKEND_URL || 'http://localhost:3001';
    return {
        plugins: [plugin(), tailwindcss()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        server: {
            proxy: {
                '/api': {
                    target,
                    secure: false,
                    changeOrigin: true,
                },
            },
            port: parseInt(env.DEV_SERVER_PORT || '49600'),
        },
    };
});
