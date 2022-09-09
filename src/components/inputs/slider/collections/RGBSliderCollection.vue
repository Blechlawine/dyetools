<template>
    <div class="sliderpart">
        <SliderPart
            v-model="red"
            label="Red"
            :min="0"
            :max="255"
            :slider-background="redBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="green"
            label="Green"
            :min="0"
            :max="255"
            :slider-background="greenBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
        <SliderPart
            v-model="blue"
            label="Blue"
            :min="0"
            :max="255"
            :slider-background="blueBackground"
            :handle-background="handleBackground"
        >
        </SliderPart>
    </div>
</template>
<script setup lang="ts">
import SliderPart from "./SliderPart.vue";
import { computed, WritableComputedRef } from "vue";

const emit = defineEmits<{
    (e: "change", rgb: { red: number; green: number; blue: number }): void;
    (e: "changeEnd"): void;
}>();

const props = defineProps({
    red: {
        type: Number,
        required: true,
    },
    green: {
        type: Number,
        required: true,
    },
    blue: {
        type: Number,
        required: true,
    },
});

const handleBackground = computed(() => `rgb(${red.value}, ${green.value}, ${blue.value})`);
const redBackground = computed(
    () => `linear-gradient(to right, rgb(0, ${green.value}, ${blue.value}), rgba(255,  ${green.value}, ${blue.value}))`
);
const greenBackground = computed(
    () => `linear-gradient(to right, rgb(${red.value}, 0, ${blue.value}), rgba(${red.value}, 255, ${blue.value}))`
);
const blueBackground = computed(
    () => `linear-gradient(to right, rgb(${red.value}, ${green.value}, 0), rgba(${red.value}, ${green.value}, 255))`
);

const red: WritableComputedRef<number> = computed({
    get: () => props.red,
    set: (r) => emit("change", { red: r, green: green.value, blue: blue.value }),
});
const green: WritableComputedRef<number> = computed({
    get: () => props.green,
    set: (g) => emit("change", { red: red.value, green: g, blue: blue.value }),
});
const blue: WritableComputedRef<number> = computed({
    get: () => props.red,
    set: (b) => emit("change", { red: red.value, green: green.value, blue: b }),
});
</script>
<style scoped></style>
