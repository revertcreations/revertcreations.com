import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig(() => ({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/home.js',
                'resources/js/projectDetail.js',
                'resources/js/app.js',
                'resources/js/playground.js',
            ],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0',
        port: Number(process.env.VITE_PORT ?? 5173),
        hmr: {
            host: process.env.VITE_HMR_HOST ?? 'localhost',
        },
    },
}));
