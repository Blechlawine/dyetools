<template>
    <div class="sliderCollection">
        <SliderPart
            v-model="l"
            label="L*"
            :min="0"
            :max="100"
            :slider-background="lBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="a"
            label="a*"
            :min="-128"
            :max="127"
            :slider-background="aBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="b"
            label="b*"
            :min="-128"
            :max="127"
            :slider-background="bBackground"
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
    (e: "change", rgb: { l: number; a: number; b: number }): void;
    (e: "changeEnd"): void;
}>();

const props = defineProps({
    l: {
        type: Number,
        required: true,
    },
    a: {
        type: Number,
        required: true,
    },
    b: {
        type: Number,
        required: true,
    },
});

const handleBackground = computed(() => {
    let chromeHandle = chroma(l.value, a.value, b.value, "lab");
    return `rgb(${chromeHandle.get("rgb.r")}, ${chromeHandle.get("rgb.g")}, ${chromeHandle.get("rgb.b")})`;
});
const lBackground = computed(() => {
    let atZero = chroma.lab(0, a.value, b.value);
    let atHundred = chroma.lab(100, a.value, b.value);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgba(${atHundred.get("rgb.r")},  ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});
const aBackground = computed(() => {
    let atZero = chroma.lab(l.value, -128, b.value);
    let atHundred = chroma.lab(l.value, 127, b.value);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgba(${atHundred.get("rgb.r")},  ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});
const bBackground = computed(() => {
    let atZero = chroma.lab(l.value, a.value, -128);
    let atHundred = chroma.lab(l.value, a.value, 127);
    return `linear-gradient(to right, rgb(${atZero.get("rgb.r")}, ${atZero.get("rgb.g")}, ${atZero.get(
        "rgb.b"
    )}), rgba(${atHundred.get("rgb.r")},  ${atHundred.get("rgb.g")}, ${atHundred.get("rgb.b")}))`;
});

const l: WritableComputedRef<number> = computed({
    get: () => props.l,
    set: (l) => emit("change", { l, a: a.value, b: b.value }),
});
const a: WritableComputedRef<number> = computed({
    get: () => props.a,
    set: (a) => emit("change", { l: l.value, a, b: b.value }),
});
const b: WritableComputedRef<number> = computed({
    get: () => props.l,
    set: (b) => emit("change", { l: l.value, a: a.value, b }),
});
</script>
<style scoped></style>
