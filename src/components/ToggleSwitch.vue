<template>
    <label class="switch" :style="backStyle">
        <div class="switchThumb" :style="thumbStyle">
            <span class="material-icons">{{ darkMode ? "dark_mode" : "light_mode" }}</span>
            <input class="checkBox" type="checkbox" ref="checkBox" @click="darkMode = !darkMode" />
        </div>
    </label>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { darkMode } from "../stores/store";

const root = ref<HTMLElement | null>(null);

onMounted(() => {
    root.value = document.documentElement;
});

watch(
    () => darkMode,
    () => {
        if (darkMode) {
            root.value?.style.setProperty("--background", "#171717");
            root.value?.style.setProperty("--light-gray", "#242424");
            root.value?.style.setProperty("--middle-gray", "#303030");
            root.value?.style.setProperty("--shadow", "rgba(0, 0, 0, 0.28)");
            root.value?.style.setProperty("--textColorDark", "var(--text-white)");
            root.value?.style.setProperty("--textColorLight", "var(--text-dark)");
        } else {
            root.value?.style.setProperty("--background", "");
            root.value?.style.setProperty("--light-gray", "");
            root.value?.style.setProperty("--middle-gray", "");
            root.value?.style.setProperty("--textColorDark", "");
            root.value?.style.setProperty("--textColorLight", "");
            root.value?.style.setProperty("--shadow", "");
        }
    }
);

const thumbStyle = computed(() => ({
    "background-color": darkMode.value ? "var(--accent)" : "var(--middle-gray)",
    transform: `translateX(${darkMode.value ? "22px" : "0px"})`,
}));
const backStyle = computed(() => ({
    "background-color": darkMode.value ? "var(--light-accent)" : "var(--light-gray)",
}));
</script>
<style scoped>
.switchThumb {
    width: 28px;
    height: 28px;
    border-radius: 14px;
    margin-top: -5px;
    margin-left: -4px;
    transition: transform 300ms, background 300ms;
    padding: 2px;
}

.switch {
    width: 42px;
    height: 18px;
    border-radius: 14px;
    background-color: var(--light-gray);
}

.checkBox {
    display: none;
}
</style>
