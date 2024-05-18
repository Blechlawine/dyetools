import ContrastChecker from "./pages/ContrastChecker.vue";
import type { RouteRecordRaw } from "vue-router";

type RouteRecord = RouteRecordRaw & {
    isTab?: boolean;
};

const routes: RouteRecord[] = [
    {
        path: "/",
        isTab: true,
        name: "contrast-checker.title",
        component: ContrastChecker,
    },
    {
        path: "/palette",
        isTab: true,
        name: "palette.title",
        component: () => import("./pages/Palette.vue"),
    },
    {
        path: "/converter",
        isTab: true,
        name: "converter.title",
        component: () => import("./pages/Converter.vue"),
    },
    {
        path: "/privacy",
        name: "privacy.title",
        component: () => import("./pages/Privacy.vue"),
    },
    {
        path: "/impressum",
        name: "impressum.title",
        component: () => import("./pages/Impressum.vue"),
    },
];

export default routes;
