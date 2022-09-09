<template>
    <Slider
        :min="0"
        :max="360"
        v-model="value"
        background="linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
        :handle-background="handleBackground"
        @change-end="emit('changeEnd')"
    >
    </Slider>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Slider from "./Slider.vue";

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
    (e: "changeEnd"): void;
}>();

const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    },
    handlePosition: {
        type: Number,
        required: true,
    },
});

const value = computed({
    get: () => props.modelValue,
    set: (v: number) => emit("update:modelValue", v),
});

const handleBackground = computed(() => `hsl(${value.value}, 100%, 50%)`);
</script>
<style scoped></style>
