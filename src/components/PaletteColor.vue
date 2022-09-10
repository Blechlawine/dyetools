<template>
    <div class="paletteColor move-transition" :style="`background-color: ${color.hex}; color: ${textColor}`">
        <div :class="classesForLeftAddColorButton">
            <span @click="emit('add', index)" class="material-icons">add</span>
        </div>
        <div class="colorInfo">
            <p class="colorLabel">
                {{ displayText }}
                <span class="material-icons" v-if="color.locked">push_pin</span>
            </p>
            <span class="material-icons copyIcon" @click="copyString(color.hex)">content_copy</span>
            <span class="material-icons editIcon" @click="emit('togglePicker')">edit</span>
            <span>
                <span :class="pinClasses" :style="`opacity: ${color.locked ? '1' : '0.6'}`" @click="emit('pin')"
                    >push_pin</span
                >
            </span>
            <span class="material-icons deleteIcon" @click="emit('delete')">delete</span>
            <span class="leftRightButtons">
                <div class="moveLeftButton" @click="emit('moveLeft')" v-if="canMoveLeft">
                    <span class="material-icons">chevron_left</span>
                </div>
                <div class="moveRightButton" @click="emit('moveRight')" v-if="canMoveRight">
                    <span class="material-icons">chevron_right</span>
                </div>
            </span>
        </div>
        <div :class="classesForRightAddColorButton">
            <span class="material-icons" @click="emit('add', index + 1)">add</span>
        </div>
        <ColorPickerBig
            responsive
            closable
            :hueIn="chroma(color.hex).get('hsv.h')"
            :satIn="chroma(color.hex).get('hsv.s')"
            :valIn="chroma(color.hex).get('hsv.v')"
            class="colorPickerBig"
            @change="emit('edit', color, $event)"
            @close="emit('togglePicker')"
            v-if="pickerOpen"
        />
    </div>
</template>
<script setup lang="ts">
import ColorPickerBig from "./picker/ColorPickerBig.vue";
import chroma from "chroma-js";
import { computed, PropType } from "vue";
import { copyString } from "../utils";

const emit = defineEmits<{
    (e: "edit", color: IColor, data: { hue: number; sat: number; val: number }): void;
    (e: "togglePicker"): void;
    (e: "add", index: number): void;
    (e: "moveRight"): void;
    (e: "moveLeft"): void;
    (e: "delete"): void;
    (e: "pin"): void;
}>();

const props = defineProps({
    color: {
        type: Object as PropType<IColor>,
        required: true,
    },
    displayType: {
        type: String,
        default: "hex",
    },
    canMoveRight: {
        type: Boolean,
        required: true,
    },
    canMoveLeft: {
        type: Boolean,
        required: true,
    },
    pickerOpen: {
        type: Boolean,
        default: false,
    },
    index: {
        type: Number,
        required: true,
    },
    maxIndex: {
        type: Number,
        required: true,
    },
});

const displayText = computed(() => {
    switch (props.displayType.toLowerCase()) {
        case "hsl":
            let hue = Math.round(chroma(props.color.hex).get("hsl.h"));
            let sat = Math.round(chroma(props.color.hex).get("hsl.s") * 100);
            let lig = Math.round(chroma(props.color.hex).get("hsl.l") * 100);
            return `hsl(${isNaN(hue) ? 0 : hue}, ${sat}%, ${lig}%)`;
        case "rgb":
            return chroma(props.color.hex).css();
        case "hex":
            return props.color.hex;
    }
});
const textColor = computed(() =>
    chroma(props.color.hex).luminance() < 0.5 ? "var(--text-white)" : "var(--text-dark)"
);
const classesForLeftAddColorButton = computed(() => ({
    addColorButton: true,
    moveLeft: props.index != 0,
    moveRight: props.index == 0,
}));
const classesForRightAddColorButton = computed(() => ({
    addColorButton: true,
    moveLeft: props.index === props.maxIndex,
    moveRight: props.index !== props.maxIndex,
}));
const pinClasses = computed(() => {
    if (props.color.locked) {
        return "material-icons pinIcon";
    } else {
        return "material-icons-outlined pinIcon";
    }
});
</script>
<style scoped>
.paletteColor {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 170px;
}
.paletteColor * {
    color: inherit;
}
.addColorButton.moveRight {
    transform: translateX(50%);
}

.copyIcon,
.pinIcon,
.editIcon,
.deleteIcon {
    cursor: pointer;
}
/* Transitions */
.move-enter,
.move-leave-to {
    transform: translateY(100%);
}

.move-leave-active {
    position: absolute;
    opacity: 0;
    height: 100%;
}

.move-enter-active *,
.move-leave-active * {
    opacity: 0;
}

.move-transition {
    transition: all 300ms;
}

.addColorIcon,
.addColorButton {
    width: 24px;
    height: 24px;
    background-color: var(--background);
    border-radius: 50%;
    color: var(--textColorDark);
    cursor: pointer;
}

.addColorButton.moveLeft {
    transform: translateX(-50%);
}

.paletteColor .colorInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-gap: 24px;
}

.colorInfo > *:not(.colorLabel) {
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms;
}

.colorLabel {
    font-size: 24px;
    transform: translateY(443%);
    transition: transform 200ms;
    display: flex;
    align-items: center;
    grid-gap: 8px;
}

.paletteColor:hover .colorInfo > * {
    opacity: 1;
    pointer-events: auto;
}

.paletteColor:hover .colorLabel {
    transform: translateY(0);
}

.leftRightButtons {
    display: flex;
    flex-direction: row;
    grid-gap: 24px;
}

.leftRightButtons .material-icons {
    font-size: 32px;
    cursor: pointer;
}

.colorPickerBig {
    position: absolute;

    z-index: 100;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
    .paletteColor {
        flex-direction: column;
        min-height: 100px;
    }

    .paletteColor .colorInfo {
        flex-direction: row;
    }

    .addColorButton.moveLeft {
        transform: translateY(-50%);
    }

    .addColorButton.moveRight {
        transform: translateY(50%);
    }

    .colorLabel {
        transform: translateX(0%);
    }

    .leftRightButtons {
        transform: rotateZ(90deg);
        width: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
