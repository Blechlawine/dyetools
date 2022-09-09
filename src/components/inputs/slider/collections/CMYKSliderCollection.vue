<template>
    <div class="sliderpart">
        <SliderPart
            v-model="cyan"
            label="Cyan"
            :min="0"
            :max="100"
            :slider-background="cyanBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="magenta"
            label="Magenta"
            :min="0"
            :max="100"
            :slider-background="magentaBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="yellow"
            label="Yellow"
            :min="0"
            :max="100"
            :slider-background="yellowBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="key"
            label="Key"
            :min="0"
            :max="100"
            :slider-background="keyBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
    </div>
</template>
<script setup lang="ts">
import SliderPart from "./SliderPart.vue";
import { computed, WritableComputedRef } from "vue";
import chroma from "chroma-js";

const emit = defineEmits<{
    (e: "change", cmyk: { c: number; m: number; y: number; k: number }): void;
    (e: "changeEnd"): void;
}>();

const props = defineProps({
    cyan: {
        type: Number,
        required: true,
    },
    magenta: {
        type: Number,
        required: true,
    },
    yellow: {
        type: Number,
        required: true,
    },
    k: {
        type: Number,
        required: true,
    },
});

const handleBackground = computed(() => {
    let chromeHandle = chroma.cmyk(cyan.value / 100, magenta.value / 100, yellow.value / 100, key.value / 100);
    return `rgb(${chromeHandle.get("rgb.r")}, ${chromeHandle.get("rgb.g")}, ${chromeHandle.get("rgb.b")})`;
});
const cyanBackground = computed(() => {
    let atZero = chroma.cmyk(0, magenta.value / 100, yellow.value / 100, key.value / 100);
    let atHundred = chroma.cmyk(1, magenta.value / 100, yellow.value / 100, key.value / 100);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgb(${atHundred.get("rgb.r")},  ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});
const magentaBackground = computed(() => {
    let atZero = chroma.cmyk(cyan.value / 100, 0, yellow.value / 100, key.value / 100);
    let atHundred = chroma.cmyk(cyan.value, 1, yellow.value / 100, key.value / 100);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgb(${atHundred.get("rgb.r")}, ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});
const yellowBackground = computed(() => {
    let atZero = chroma.cmyk(cyan.value, magenta.value / 100, 0, key.value / 100);
    let atHundred = chroma.cmyk(cyan.value, magenta.value / 100, 1, key.value / 100);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgb(${atHundred.get("rgb.r")}, ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});
const keyBackground = computed(() => {
    let atZero = chroma.cmyk(cyan.value, magenta.value / 100, yellow.value / 100, 0);
    let atHundred = chroma.cmyk(cyan.value, magenta.value / 100, yellow.value / 100, 1);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgb(${atHundred.get("rgb.r")}, ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});

const cyan: WritableComputedRef<number> = computed({
    get: () => props.cyan,
    set: (c) => emit("change", { c, m: magenta.value, y: yellow.value, k: key.value }),
});
const magenta: WritableComputedRef<number> = computed({
    get: () => props.cyan,
    set: (m) => emit("change", { c: cyan.value, m, y: yellow.value, k: key.value }),
});
const yellow: WritableComputedRef<number> = computed({
    get: () => props.cyan,
    set: (y) => emit("change", { c: cyan.value, m: magenta.value, y, k: key.value }),
});
const key: WritableComputedRef<number> = computed({
    get: () => props.k,
    set: (k) => emit("change", { c: cyan.value, m: magenta.value, y: yellow.value, k }),
});
</script>
<style scoped></style>
