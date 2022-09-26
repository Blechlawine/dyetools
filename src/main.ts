import { createApp } from "vue";
import "./global.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
    MdShare,
    MdRefresh,
    MdContentcopy,
    MdExpandmore,
    MdExpandless,
    MdRemove,
    MdAdd,
    MdClose,
    MdPushpin,
    MdPushpinOutlined,
    MdEdit,
    MdChevronleft,
    MdChevronright,
    MdDelete,
    MdDarkmode,
    MdLightmode,
    MdDone,
} from "oh-vue-icons/icons";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

addIcons(
    MdShare,
    MdRefresh,
    MdContentcopy,
    MdExpandmore,
    MdExpandless,
    MdRemove,
    MdAdd,
    MdClose,
    MdPushpin,
    MdPushpinOutlined,
    MdEdit,
    MdChevronleft,
    MdChevronright,
    MdDelete,
    MdDarkmode,
    MdLightmode,
    MdDone,
);

createApp(App).component("ovIcon", OhVueIcon).use(router).mount("#app");
