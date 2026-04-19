"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = defineNuxtConfig({
    compatibilityDate: '2025-04-01',
    modules: [
        '@pinia/nuxt',
        '@nuxtjs/color-mode',
        '@nuxt/icon',
        '@nuxt/fonts',
    ],
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [
            Promise.resolve().then(function () { return require('@tailwindcss/vite'); }).then(function (m) { return m.default(); }),
        ],
    },
    app: {
        baseURL: '/simple-crud-vue/',
        head: {
            title: 'SCV — Simple Crud Vue',
            htmlAttrs: { lang: 'en' },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Modern Contacts CRUD — Nuxt 4, Vue 3, Tailwind CSS 4' },
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            ],
        },
    },
    colorMode: {
        classSuffix: '',
        preference: 'system',
        fallback: 'dark',
    },
    fonts: {
        families: [
            { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700, 800, 900] },
        ],
    },
    icon: {
        serverBundle: 'local',
    },
    typescript: {
        strict: true,
    },
});
