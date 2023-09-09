<template>
    <div
        class="paletteColor move-transition"
        :style="`background-color: ${color.hex}; color: ${textColor}; fill: ${textColor}`"
    >
        <div :class="classesForLeftAddColorButton">
            <Icon name="i-tabler-plus" @click="emit('add', index)"></Icon>
        </div>
        <div class="colorInfo">
            <p class="colorLabel">
                {{ displayText }}
                <Icon name="i-tabler-pin-filled" v-if="color.locked"></Icon>
            </p>
            <Icon name="i-tabler-copy" class="copyIcon" @click="copyString(color.hex)"></Icon>
            <Icon name="i-tabler-pencil" class="editIcon" @click="emit('togglePicker')"></Icon>
            <span>
                <Icon
                    v-if="color.locked"
                    class="pinIcon"
                    name="i-tabler-pin-filled"
                    :style="`opacity: ${color.locked ? '1' : '0.6'}`"
                    @click="emit('pin')"
                ></Icon>
                <Icon
                    v-else
                    class="pinIcon"
                    name="i-tabler-pin"
                    :style="`opacity: ${color.locked ? '1' : '0.6'}`"
                    @click="emit('pin')"
                ></Icon>
            </span>
            <Icon name="i-tabler-trash" class="deleteIcon" @click="emit('delete')"></Icon>
            <span class="leftRightButtons">
                <div class="moveLeftButton" @click="emit('moveLeft')" v-if="canMoveLeft">
                    <Icon name="i-tabler-chevron-left"></Icon>
                </div>
                <div class="moveRightButton" @click="emit('moveRight')" v-if="canMoveRight">
                    <Icon name="i-tabler-chevron-right"></Icon>
                </div>
            </span>
        </div>
        <div :class="classesForRightAddColorButton">
            <Icon name="i-tabler-plus" @click="emit('add', index + 1)"></Icon>
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
import Icon from "./Icon.vue";
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
    fill: inherit;
}
.addColorButton.moveRight {
    transform: translateX(50%);
}

.copyIcon,
.pinIcon,
.editIcon,
.moveLeftButton,
.moveRightButton,
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
    fill: var(--textColorDark);
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
