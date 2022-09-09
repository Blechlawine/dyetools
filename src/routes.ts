import { RouteRecordRaw } from "vue-router";
import ContrastChecker from "./pages/ContrastChecker.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Contrast-checker",
        component: ContrastChecker,
    },
    {
        path: "/palette",
        name: "Palette",
        component: import("./pages/Palette.vue"),
    },
    {
        path: "/converter",
        name: "Converter",
        component: import("./pages/Converter.vue"),
    },
];

export default routes;
