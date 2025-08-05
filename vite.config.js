import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: '/auralyst/', 

    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                actives: 'actives.html',
                my_routine: 'my_routine.html',
                products: 'products.html',
                routine: 'routine.html',
            },
        },
    },

    plugins: [
        tailwindcss()
    ]
});