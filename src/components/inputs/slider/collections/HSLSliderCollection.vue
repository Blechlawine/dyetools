<template>
    <div class="sliderCollection">
        <SliderPart
            v-model="_hue"
            label="Hue"
            :min="0"
            :max="360"
            :slider-background="hueBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="_saturation"
            label="Saturation"
            :min="0"
            :max="100"
            :slider-background="saturationBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="_lightness"
            label="Lightness"
            :min="0"
            :max="100"
            :slider-background="lightnessBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
    </div>
</template>
<script setup lang="ts">
import SliderPart from "./SliderPart.vue";
import { computed, WritableComputedRef } from "vue";

const emit = defineEmits<{
    (e: "change", hsl: { hue: number; saturation: number; lightness: number }): void;
    (e: "changeEnd"): void;
}>();

const props = defineProps({
    hue: {
        type: Number,
        required: true,
    },
    saturation: {
        type: Number,
        required: true,
    },
    lightness: {
        type: Number,
        required: true,
    },
});

const handleBackground = computed(() => `hsl(${_hue.value}, ${_saturation.value}%, ${_lightness.value}%)`);
const hueBackground = computed(
    () =>
        `linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`
);
const saturationBackground = computed(
    () =>
        `linear-gradient(to right, hsl(${Math.round(_hue.value)}, 0%, ${Math.round(_lightness.value)}%), hsl(${Math.round(
            _hue.value
        )}, 100%, ${Math.round(_lightness.value)}%))`
);
const lightnessBackground = computed(
    () =>
        `linear-gradient(to right, hsl(${Math.round(_hue.value)}, ${Math.round(
            _saturation.value
        )}%, 0%), hsl(${Math.round(_hue.value)}, ${Math.round(_saturation.value)}%, 50%), hsl(${Math.round(
            _hue.value
        )}, ${Math.round(_saturation.value)}%, 100%))`
);

const _hue: WritableComputedRef<number> = computed({
    get: () => props.hue,
    set: (h) => emit("change", { hue: h, saturation: _saturation.value, lightness: _lightness.value }),
});
const _saturation: WritableComputedRef<number> = computed({
    get: () => props.saturation,
    set: (s) => emit("change", { hue: _hue.value, saturation: s, lightness: _lightness.value }),
});
const _lightness: WritableComputedRef<number> = computed({
    get: () => props.lightness,
    set: (l) => emit("change", { hue: _hue.value, saturation: _saturation.value, lightness: l }),
});
</script>
<style scoped></style>
