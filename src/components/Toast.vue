<template>
    <div v-if="toastText !== null && toastText.length > 0">
        {{ toastText }}
    </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { toastText } from "../stores/store";

const props = defineProps({
    time: {
        type: Number,
        default: 1200,
    },
});

watch(
    () => toastText.value,
    () => {
        if (toastText.value && toastText.value.length > 0) {
            setTimeout(() => {
                toastText.value = null;
            }, props.time);
        }
    }
);
</script>

<style scoped>
.toast {
    margin-left: 50%;
    position: absolute;
    padding: 12px 50px;
    z-index: 1000;
    background: var(--background);
    box-shadow: var(--shadow4px);
    border-radius: 6px;
    transform: translate(-50%, -100px);
    transition: transform 200ms;
    pointer-events: none;
}

.toast.show {
    transform: translate(-50%, 8px);
}
</style>
