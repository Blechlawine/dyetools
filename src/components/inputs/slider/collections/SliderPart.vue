<template>
    <div class="sliderpart" :style="backgroundStyle">
        <div class="horizontalFlex">
            <p :style="textStyle">{{ label }}</p>
            <NumberInput :model-value="Math.round(value)" @update:model-value="value = $event" />
        </div>
        <Slider
            :min="min"
            :max="max"
            :background="sliderBackground"
            v-model="value"
            :handleBackground="handleBackground"
            @changeEnd="emit('changeEnd')"
        />
    </div>
</template>
<script setup lang="ts">
import NumberInput from "../../NumberInput.vue";
import Slider from "../Slider.vue";
import chroma from "chroma-js";
import { computed } from "vue";

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
    (e: "changeEnd"): void;
}>();

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    modelValue: {
        type: Number,
        required: true,
    },
    min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
    sliderBackground: {
        type: String,
        default: "#FFFFFF",
    },
    handleBackground: {
        type: String,
        default: "#FFFFFF",
    },
    coloredBackground: {
        type: Boolean,
        default: false,
    },
    background: {
        type: String,
        default: "#FFFFFF",
    },
});

const value = computed({
    get: () => props.modelValue,
    set: (v: number) => emit("update:modelValue", v),
});
const textStyle = computed(() => ({
    color: props.coloredBackground ? (chroma(props.background).luminance() < 0.5 ? "white" : "black") : "var(--textColorDark)",
}));
const backgroundStyle = computed(() => ({
    background: props.coloredBackground ? props.background : "var(--background)",
}));
</script>
<style scoped>
.sliderpart p {
    user-select: none;
}
</style>
