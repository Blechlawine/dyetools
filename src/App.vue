<script setup lang="ts">
import MenuBar from "./components/menubar/MenuBar.vue";
import Toast from "./components/Toast.vue";
import { toastText } from "./stores/store";

const tabs = [
    { id: 0, title: "Contrast-checker", link: "/" },
    { id: 1, title: "Palette", link: "/palette" },
    { id: 2, title: "Converter", link: "/converter" },
];
</script>

<template>
    <MenuBar :tabs="tabs" />
    <Toast :message="toastText"></Toast>
    <router-view></router-view>
</template>
