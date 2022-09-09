<template>
    <div @mousedown="handleMouseDown" class="slider" ref="sliderRef" :style="sliderBackground">
        <div :style="handleStyles" class="sliderHandle"></div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, VNodeRef, watch } from "vue";
import { scale } from "../../../utils";

const emit = defineEmits<{
    (e: "changeEnd", value: number): void;
    (e: "update:modelValue", value: number): void;
}>();

const props = defineProps({
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
    background: {
        type: String,
        required: true,
    },
    handleBackground: {
        type: String,
        required: true,
    },
});

const val = ref(0);
const mouseDownPosX = ref(0);
const distanceMouseMoved = ref(0);
const minX = ref(0);
const maxX = ref(0);
const sliderRef = ref<VNodeRef | undefined>(undefined);

const handleStyles = computed(() => ({
    "background-color": props.handleBackground,
    "margin-left": handlePosition.value + "px",
}));
const sliderBackground = computed(() => ({
    background: props.background,
}));
const handlePosition = computed(() => scale(val.value, props.min, props.max, minX.value, maxX.value));

watch(
    () => props.modelValue,
    () => (val.value = props.modelValue)
);

onMounted(() => {
    maxX.value = sliderRef.value.clientWidth - 4;
    val.value = props.modelValue;
    sliderRef.value.addEventListener("touchstart", handleTouchStart);
});

const handleMouseDown = (event: MouseEvent) => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    mouseDownPosX.value = event.clientX;
    let relativeX = mouseDownPosX.value - sliderRef.value.getBoundingClientRect().left;
    setHandlePos(Math.max(Math.min(relativeX, maxX.value), minX.value));
};
const handleMouseMove = (event: MouseEvent) => {
    distanceMouseMoved.value = event.clientX - mouseDownPosX.value;
    let relativeX = mouseDownPosX.value - sliderRef.value.getBoundingClientRect().left + distanceMouseMoved.value;
    setHandlePos(Math.max(Math.min(relativeX, maxX.value), minX.value));
};
const handleMouseUp = (event: MouseEvent) => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    emit("changeEnd", val.value);
};
const setHandlePos = (pos: number) => {
    val.value = scale(pos, minX.value, maxX.value, props.min, props.max);
    emit("update:modelValue", val.value);
};
const handleTouchStart = (event: TouchEvent) => {
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);
    mouseDownPosX.value = event.touches[0].clientX;
    let relativeX = mouseDownPosX.value - sliderRef.value.getBoundingClientRect().left;
    setHandlePos(Math.max(Math.min(relativeX, maxX.value), minX.value));
};
const handleTouchMove = (event: TouchEvent) => {
    distanceMouseMoved.value = event.touches[0].clientX - mouseDownPosX.value;
    let relativeX = mouseDownPosX.value - sliderRef.value.getBoundingClientRect().left + distanceMouseMoved.value;
    setHandlePos(Math.max(Math.min(relativeX, maxX.value), minX.value));
};
const handleTouchEnd = (event: TouchEvent) => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
    emit("changeEnd", val.value);
};
</script>
<style scoped>
.slider {
    width: calc(100% - 24px);
    height: 10px;
    border-radius: 5px;

    position: relative;
    margin: 12px;

    border: 1px solid var(--light-gray);
}

.sliderHandle {
    position: absolute;
    top: -8px;
    left: -10px;

    border: 4px solid var(--white);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    box-shadow: var(--shadow2px);
}
</style>
