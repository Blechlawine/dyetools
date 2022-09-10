import { ref } from "vue";

export const toastText = ref<string | null>(null);
export const darkMode = ref(false);

export const prevHighlightWidth = ref(0);
export const prevHighlightMarginLeft = ref(0);