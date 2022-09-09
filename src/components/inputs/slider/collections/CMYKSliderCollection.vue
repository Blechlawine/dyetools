<template>
    <div class="sliderCollection">
        <SliderPart
            v-model="_cyan"
            label="Cyan"
            :min="0"
            :max="100"
            :slider-background="cyanBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="_magenta"
            label="Magenta"
            :min="0"
            :max="100"
            :slider-background="magentaBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="_yellow"
            label="Yellow"
            :min="0"
            :max="100"
            :slider-background="yellowBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="_key"
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
    let chromeHandle = chroma.cmyk(_cyan.value / 100, _magenta.value / 100, _yellow.value / 100, _key.value / 100);
    return `rgb(${chromeHandle.get("rgb.r")}, ${chromeHandle.get("rgb.g")}, ${chromeHandle.get("rgb.b")})`;
});
const cyanBackground = computed(() => {
    let atZero = chroma.cmyk(0, _magenta.value / 100, _yellow.value / 100, _key.value / 100);
    let atHundred = chroma.cmyk(1, _magenta.value / 100, _yellow.value / 100, _key.value / 100);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgb(${atHundred.get("rgb.r")},  ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});
const magentaBackground = computed(() => {
    let atZero = chroma.cmyk(_cyan.value / 100, 0, _yellow.value / 100, _key.value / 100);
    let atHundred = chroma.cmyk(_cyan.value / 100, 1, _yellow.value / 100, _key.value / 100);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgb(${atHundred.get("rgb.r")}, ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});
const yellowBackground = computed(() => {
    let atZero = chroma.cmyk(_cyan.value / 100, _magenta.value / 100, 0, _key.value / 100);
    let atHundred = chroma.cmyk(_cyan.value / 100, _magenta.value / 100, 1, _key.value / 100);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgb(${atHundred.get("rgb.r")}, ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});
const keyBackground = computed(() => {
    let atZero = chroma.cmyk(_cyan.value / 100, _magenta.value / 100, _yellow.value / 100, 0);
    let atHundred = chroma.cmyk(_cyan.value / 100, _magenta.value / 100, _yellow.value / 100, 1);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgb(${atHundred.get("rgb.r")}, ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});

const _cyan: WritableComputedRef<number> = computed({
    get: () => props.cyan,
    set: (c) => emit("change", { c, m: _magenta.value, y: _yellow.value, k: _key.value }),
});
const _magenta: WritableComputedRef<number> = computed({
    get: () => props.cyan,
    set: (m) => emit("change", { c: _cyan.value, m, y: _yellow.value, k: _key.value }),
});
const _yellow: WritableComputedRef<number> = computed({
    get: () => props.cyan,
    set: (y) => emit("change", { c: _cyan.value, m: _magenta.value, y, k: _key.value }),
});
const _key: WritableComputedRef<number> = computed({
    get: () => props.k,
    set: (k) => emit("change", { c: _cyan.value, m: _magenta.value, y: _yellow.value, k }),
});
</script>
<style scoped></style>