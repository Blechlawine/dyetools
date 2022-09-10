<template>
    <button :class="classes">
        <slot></slot>
    </button>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    variant: {
        type: String,
        default: "secondary",
        validator: (value: string) => {
            return ["secondary", "primary"].includes(value);
        },
    },
});

const classes = computed(() => ({
    button: true,
    primary: props.variant === "primary",
    secondary: props.variant === "secondary",
}));
</script>
<style scoped>
button {
    border: none;
    outline: none;
}

.button {
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.primary {
    color: var(--textColorLight);
    background-color: var(--accent);
}

.secondary {
    color: var(--textColorDark);
    background-color: var(--light-gray);
}
</style>
