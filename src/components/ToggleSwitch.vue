<template>
    <label class="switch" :style="backStyle">
        <div class="switchThumb" :style="thumbStyle">
            <Icon :name="darkMode ? 'md-darkmode' : 'md-lightmode'"></Icon>
            <input class="checkBox" type="checkbox" ref="checkBox" @click="toggleDarkMode()" />
        </div>
    </label>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { darkMode, toggleDarkMode } from "../stores/store";
import Icon from "./Icon.vue";

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
