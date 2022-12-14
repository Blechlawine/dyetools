<template>
    <div @mousedown="handleMouseDown" class="satValPicker" :style="gradientStyles" ref="fieldRef">
        <div class="satValHandle" :style="handleStyles"></div>
    </div>
</template>
<script setup lang="ts">
import chroma from "chroma-js";
import { computed, onMounted, ref, VNodeRef, watch } from "vue";
import { scale } from "../../utils";

const emit = defineEmits<{
    (e: "changeEnd", value: {s: number, v: number}): void;
    (e: "change", value: {s: number; v: number}): void;
}>();

const props = defineProps({
    hue: {
        type: Number,
        required: true,
        default: 0,
    },
    saturation: {
        type: Number,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
});

const sat = ref(0);
const val = ref(0);
const mouseDownPosX = ref(0);
const mouseDownPosY = ref(0);
const distanceMouseMovedX = ref(0);
const distanceMouseMovedY = ref(0);
const minX = ref(0);
const minY = ref(0);
const maxX = ref(0);
const maxY = ref(0);
const fieldRef = ref<VNodeRef | undefined>(undefined);

const gradientStyles = computed(() => ({
    background: `linear-gradient(to top, black, rgba(255, 255, 255, 0)), linear-gradient(to right, hsla(${props.hue}, 0%, 100%, 1), hsla(${props.hue}, 100%, 50%, 1))`,
}));
const handleStyles = computed(() => ({
    "background-color": chroma.hsv(props.hue, sat.value, val.value).css(),
    "margin-left": handlePosX.value + "px",
    "margin-top": handlePosY.value + "px",
}));
const handlePosX = computed(() => scale(props.saturation, 0, 1, minX.value, maxX.value));
const handlePosY = computed(() => scale(props.value, 0, 1, maxY.value, minY.value));

watch(
    () => props.saturation,
    () => (sat.value = props.saturation)
);
watch(
    () => props.value,
    () => (val.value = props.value)
);

onMounted(() => {
    maxX.value = fieldRef.value.clientWidth - 4;
    maxY.value = fieldRef.value.clientHeight - 4;
    sat.value = props.saturation;
    val.value = props.value;
    fieldRef.value.addEventListener("touchstart", handleTouchStart);
});

const handleMouseDown = (event: MouseEvent) => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    mouseDownPosX.value = event.clientX;
    mouseDownPosY.value = event.clientY;
    let relativeX = mouseDownPosX.value - fieldRef.value.getBoundingClientRect().left;
    let relativeY = mouseDownPosY.value - fieldRef.value.getBoundingClientRect().top;
    setHandlePos(
        Math.max(Math.min(relativeX, maxX.value), minX.value),
        Math.max(Math.min(relativeY, maxY.value), minY.value)
    );
};
const handleMouseMove = (event: MouseEvent) => {
    distanceMouseMovedX.value = event.clientX - mouseDownPosX.value;
    distanceMouseMovedY.value = event.clientY - mouseDownPosY.value;
    let relativeX = mouseDownPosX.value - fieldRef.value.getBoundingClientRect().left + distanceMouseMovedX.value;
    let relativeY = mouseDownPosY.value - fieldRef.value.getBoundingClientRect().top + distanceMouseMovedY.value;
    setHandlePos(
        Math.max(Math.min(relativeX, maxX.value), minX.value),
        Math.max(Math.min(relativeY, maxY.value), minY.value)
    );
};
const handleMouseUp = (event: MouseEvent) => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    emit("changeEnd", { s: sat.value, v: val.value });
};
const handleTouchStart = (event: TouchEvent) => {
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);
    mouseDownPosX.value = event.touches[0].clientX;
    mouseDownPosY.value = event.touches[0].clientY;
    let relativeX = mouseDownPosX.value - fieldRef.value.getBoundingClientRect().left;
    let relativeY = mouseDownPosY.value - fieldRef.value.getBoundingClientRect().top;
    setHandlePos(
        Math.max(Math.min(relativeX, maxX.value), minX.value),
        Math.max(Math.min(relativeY, maxY.value), minY.value)
    );
};
const handleTouchMove = (event: TouchEvent) => {
    distanceMouseMovedX.value = event.touches[0].clientX - mouseDownPosX.value;
    distanceMouseMovedY.value = event.touches[0].clientY - mouseDownPosY.value;
    let relativeX = mouseDownPosX.value - fieldRef.value.getBoundingClientRect().left + distanceMouseMovedX.value;
    let relativeY = mouseDownPosY.value - fieldRef.value.getBoundingClientRect().top + distanceMouseMovedY.value;
    setHandlePos(
        Math.max(Math.min(relativeX, maxX.value), minX.value),
        Math.max(Math.min(relativeY, maxY.value), minY.value)
    );
};
const handleTouchEnd = (event: TouchEvent) => {
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
    emit("changeEnd", { s: sat.value, v: val.value });
};
const setHandlePos = (x: number, y: number) => {
    sat.value = scale(x, minX.value, maxX.value, 0, 1);
    val.value = scale(y, maxY.value, minY.value, 0, 1);
    emit("change", { s: sat.value, v: val.value });
};
</script>
<style scoped>
.satValPicker {
    width: 100%;
    height: 200px;
    border-radius: 6px;

    background-color: white;

    /* Das blockiert scrollen wenn man den Picker toucht */
    touch-action: none;
    position: relative;
}

.satValHandle {
    position: absolute;

    left: -8px;
    top: -8px;

    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 4px solid var(--white);
    box-shadow: var(--shadow2px);
}
</style>
