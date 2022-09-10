<template>
    <div class="swatches" ref="swatchesRef">
        <div class="bigSwatches">
            <div class="swatch" :style="firstStyle" @click="swatchClick(first.hex)">
                <div class="bigSwatchLabel">{{ first.name }}</div>
            </div>
            <div class="swatch" :style="secondStyle" @click="swatchClick(second.hex)">
                <div class="bigSwatchLabel">{{ second.name }}</div>
            </div>
            <div class="swatch" :style="thirdStyle" @click="swatchClick(third.hex)">
                <div class="bigSwatchLabel">{{ third.name }}</div>
            </div>
        </div>
        <div class="smolSwatches">
            <div
                v-for="swatch in swatches"
                class="smolSwatch"
                :style="`background-color: #${swatch.hex}`"
                @click="swatchClick(swatch.hex)"
            >
                <div class="swatchLabel">{{ upperCase ? swatch.name.toUpperCase() : swatch.name }}</div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import chroma from "chroma-js";
import { computed, onMounted, ref, watch } from "vue";

interface ISwatch {
    name: string;
    hex: string;
}

const emit = defineEmits<{
    (e: "change", hex: string): void;
}>();

const props = defineProps({
    hex: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    triggerSort: {
        type: Number,
    },
});

watch(
    () => props.triggerSort,
    () => sortSwatches()
);
watch(
    () => props.type,
    () => fetchData()
);

onMounted(() => {
    fetchData();
});

const swatches = ref<ISwatch[]>([]);
const swatchesRef = ref<HTMLElement | undefined>();

const upperCase = computed(() => props.type !== "name");
const first = computed(() => ({
    name: upperCase.value ? swatches.value[0]?.name.toUpperCase() ?? "Loading..." : swatches.value[0].name,
    hex: swatches.value[0]?.hex ?? "#fff",
}));
const second = computed(() => ({
    name: upperCase.value ? swatches.value[1]?.name.toUpperCase() ?? "Loading..." : swatches.value[1].name,
    hex: swatches.value[1]?.hex ?? "#fff",
}));
const third = computed(() => ({
    name: upperCase.value ? swatches.value[2]?.name.toUpperCase() ?? "Loading..." : swatches.value[2].name,
    hex: swatches.value[2]?.hex ?? "#fff",
}));
const firstStyle = computed(() => ({
    backgroundColor: `#${first.value.hex}`,
}));
const secondStyle = computed(() => ({
    backgroundColor: `#${second.value.hex}`,
}));
const thirdStyle = computed(() => ({
    backgroundColor: `#${third.value.hex}`,
}));

const sortSwatches = () => {
    swatches.value.sort((a, b) => {
        let aDist = chroma.distance(a.hex, props.hex);
        let bDist = chroma.distance(b.hex, props.hex);

        return aDist - bDist;
    });
};
const fetchData = async () => {
    const data = await fetch(`/api/${props.type}.json`);
    swatches.value = await data.json();
    sortSwatches();
};
const swatchClick = (color: string) => {
    swatchesRef.value?.scroll(0, 0);
    emit("change", color);
};
</script>
<style scoped>
.smolSwatches {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    grid-gap: 8px;
}

.smolSwatch {
    /* z-index: 1; */
    width: 24px;
    height: 24px;
    border-radius: 6px;

    border: 1px solid var(--light-gray);

    position: relative;
}

.smolSwatch:hover > .swatchLabel {
    opacity: 1;
}

.swatchLabel,
.bigSwatchLabel {
    z-index: 2;

    background-color: var(--labelBackground);
    border-radius: 6px;
    padding: 4px;

    width: min-Content;

    text-align: center;

    margin-left: 50%;

    pointer-events: none;

    transition: opacity 100ms;
}

.swatchLabel {
    box-shadow: var(--shadow4px);
    position: absolute;
    transform: translate(-50%, -100%);
    opacity: 0;
}

.bigSwatchLabel {
    margin-top: 50%;
    transform: translate(-50%, -50%);
}

.bigSwatches {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    grid-gap: 8px;

    width: 100%;
    height: calc(24px * 3 + 16px);

    margin-bottom: 8px;
}

.swatch {
    width: calc(24px * 3 + 16px);
    height: 100%;

    border-radius: 6px;
}

.swatches {
    max-height: 300px;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>
