<script setup lang="ts">
import TheFooter from "./components/TheFooter.vue";
import MenuBar from "./components/menubar/MenuBar.vue";
import Toast from "./components/Toast.vue";
import { toastText } from "./stores/store";
import { useShynet } from "./composables/useShynet";
import { useRouter } from "vue-router";

const shynet = useShynet();

const Router = useRouter();

Router.afterEach(() => {
    shynet.newPageLoad();
});

const tabs = [
    { id: 0, title: "Contrast-checker", link: "/" },
    { id: 1, title: "Palette", link: "/palette" },
    { id: 2, title: "Converter", link: "/converter" },
];
</script>
<template>
    <MenuBar :tabs="tabs" />
    <Toast :message="toastText"></Toast>
    <div class="content">
        <router-view></router-view>
    </div>
    <TheFooter />
</template>
