import ContrastChecker from "./pages/ContrastChecker.vue";
import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "contrast-checker.title",
        component: ContrastChecker,
    },
    {
        path: "/palette",
        name: "palette.title",
        component: () => import("./pages/Palette.vue"),
    },
    {
        path: "/converter",
        name: "converter.title",
        component: () => import("./pages/Converter.vue"),
    },
];

export default routes;
