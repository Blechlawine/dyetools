import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createRouter, createWebHistory } from "vue-router";
import de from "../locales/de.json";
import en from "../locales/en.json";
import App from "./App.vue";
import "./global.css";
import routes from "./routes";
import "virtual:uno.css";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const i18n = createI18n({
    locale: "en",
    fallbackLocale: "en",
    legacy: false,
    messages: {
        en,
        de,
    },
});

createApp(App).use(i18n).use(router).mount("#app");
