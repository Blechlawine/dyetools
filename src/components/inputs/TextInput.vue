<template>
    <div class="textInput">
        <input
            type="text"
            :placeholder="placeholder"
            :style="textBoxBorder"
            v-model="text"
            @focus="() => (active = true)"
            @blur="() => (active = false)"
        />
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const props = defineProps({
    placeholder: String,
    valid: Boolean,
    modelValue: String,
});

const text = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue ?? "");
    },
});
const active = ref(false);

const textBoxBorder = computed(() => ({
    border: `2px solid ${props.valid ? (active.value ? "var(--accent)" : "var(--light-gray)") : "var(--warning-red)"}`,
}));
</script>
<style scoped>
.textInput > input {
    outline: none;
    padding: 10px;
    border-radius: 6px;
    background-color: var(--background);
}
</style>
