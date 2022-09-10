import { ref, watch } from "vue";

export const toastText = ref<string | null>(null);
export const darkMode = ref(localStorage.getItem("darkMode") === "true" ?? false);

watch(darkMode, (newDarkMode) => {
    localStorage.setItem("darkMode", newDarkMode.toString());
});

export const prevHighlightWidth = ref(0);
export const prevHighlightMarginLeft = ref(0);
