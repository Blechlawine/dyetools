import { useDark, useToggle } from "@vueuse/core";
import { ref } from "vue";

export const toastText = ref<string | null>(null);
export const darkMode = useDark();
export const toggleDarkMode = useToggle(darkMode);

export const prevHighlightWidth = ref(0);
export const prevHighlightMarginLeft = ref(0);
