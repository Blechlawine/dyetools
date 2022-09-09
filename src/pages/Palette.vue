<template>
    <teleport to='head' >
        <meta name="description" :content="colors.map(c => c.hex).join(', ')" />
        <meta property="og:description" :content="colors.map(c => c.hex).join(', ')" />
        <meta property="og:title" content="Dyetools - Color palette">
        <title>Dyetools - Color palette</title>
    </teleport>
    <div class="palette">
        <div class="settingsBar">
            <Dropdown :values="harmonyValues" @onSelect="changeHarmony" />
            <Dropdown :values="displayTypes" @onSelect="changeDisplayType" />
            <ImgButton icon="share" @click="share" />
            <ImgButton icon="refresh" @click="generateColorsForSelectedHarmony"></ImgButton>
        </div>
        <transition-group name="move" tag="div" class="paletteColors">
            <div
                v-for="(color, index) in colors"
                class="paletteColor move-transition"
                :style="`background-color: ${color.hex}; color: ${textColor(color.hex)}`"
                :key="color.hashId"
            >
                <div :class="getClassesForLeftAddColorButton(index)">
                    <span @click="addColor(index)" class="material-icons">add</span>
                </div>
                <div class="colorInfo">
                    <p class="colorLabel">
                        {{ getDisplayText(color.hex) }}
                        <span class="material-icons" v-if="color.locked">push_pin</span>
                    </p>
                    <span class="material-icons copyIcon" @click="copyString(color.hex)">content_copy</span>
                    <span class="material-icons editIcon" @click="togglePicker(index)">edit</span>
                    <span>
                        <span
                            :class="pinClasses(color.locked)"
                            :style="`opacity: ${color.locked ? '1' : '0.6'}`"
                            @click="pinColor(index)"
                            >push_pin</span
                        >
                    </span>
                    <span class="material-icons deleteIcon" @click="deleteColor(index)">delete</span>
                    <span class="leftRightButtons">
                        <div class="moveLeftButton" @click="moveColorLeft(index)" v-if="index !== 0">
                            <span class="material-icons">chevron_left</span>
                        </div>
                        <div class="moveRightButton" @click="moveColorRight(index)" v-if="index !== colors.length - 1">
                            <span class="material-icons">chevron_right</span>
                        </div>
                    </span>
                </div>
                <div :class="getClassesForRightAddColorButton(index)">
                    <span class="material-icons" @click="addColor(index + 1)">add</span>
                </div>
                <ColorPickerBig
                    responsive
                    closable
                    :hueIn="chroma(color.hex).get('hsv.h')"
                    :satIn="chroma(color.hex).get('hsv.s')"
                    :valIn="chroma(color.hex).get('hsv.v')"
                    class="colorPickerBig"
                    @colorChanged="editColor(color, $event)"
                    @pickerClose="togglePicker(index)"
                    v-if="openPickerId === index"
                />
            </div>
        </transition-group>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { genRandHex, copyString } from "../utils";
import chroma from "chroma-js";
import { useRouter } from "vue-router";
import { toastText } from "../stores/store";
import ImgButton from "../components/button/ImgButton.vue";

const Router = useRouter();

const harmonyValues = [
    "Auto",
    "Analogous",
    "Monochromatic",
    "Complementary",
    "Split-complementary",
    "Triadic",
    "Tetradic",
    "Square",
    "Cool",
    "Warm",
    "Random",
];
const displayTypes = ["HEX", "RGB", "HSL"];
const colors = ref<IColor[]>([
    {
        hashId: genRandHex(6),
        hex: "#FFFFFF",
        locked: false,
    },
    {
        hashId: genRandHex(6),
        hex: "#FFFFFF",
        locked: false,
    },
    {
        hashId: genRandHex(6),
        hex: "#FFFFFF",
        locked: false,
    },
    {
        hashId: genRandHex(6),
        hex: "#FFFFFF",
        locked: false,
    },
    {
        hashId: genRandHex(6),
        hex: "#FFFFFF",
        locked: false,
    },
]);
const openPickerId = ref(-1);
const harmony = ref("auto");
const selectedDisplayType = ref("HEX");

const moveColorLeft = (id: number) => {
    let tempColors = colors.value;
    let temp = tempColors[id];
    tempColors[id] = tempColors[id - 1];
    tempColors[id - 1] = temp;
    colors.value = tempColors;
    updateRoute();
};
const moveColorRight = (id: number) => {
    let tempColors = colors.value;
    let temp = tempColors[id];
    tempColors[id] = tempColors[id + 1];
    tempColors[id + 1] = temp;
    colors.value = tempColors;
    updateRoute();
};
const getClassesForLeftAddColorButton = (index: number) => ({
    addColorButton: true,
    moveLeft: index != 0,
    moveRight: index == 0,
});
const getClassesForRightAddColorButton = (index: number) => ({
    addColorButton: true,
    moveLeft: index == colors.value.length - 1,
    moveRight: index != colors.value.length - 1,
});
const getDisplayText = (hexIn: string) => {
    switch (selectedDisplayType.value.toLowerCase()) {
        case "hsl":
            let hue = Math.round(chroma(hexIn).get("hsl.h"));
            let sat = Math.round(chroma(hexIn).get("hsl.s") * 100);
            let lig = Math.round(chroma(hexIn).get("hsl.l") * 100);
            return `hsl(${isNaN(hue) ? 0 : hue}, ${sat}%, ${lig}%)`;
        case "rgb":
            return chroma(hexIn).css();
        case "hex":
            return hexIn;
    }
};
const changeHarmony = (valueIndex: number) => {
    harmony.value = harmonyValues[valueIndex].toLowerCase();
    generateColorsForSelectedHarmony();
};
const changeDisplayType = (valueIndex: number) => {
    selectedDisplayType.value = displayTypes[valueIndex];
};
const share = () => {
    let path = window.location.href;
    copyString(path);
    toastText.value = "Link copied!";
};
const textColor = (hex: string) => (chroma(hex).luminance() < 0.5 ? "var(--text-white)" : "var(--text-dark)");
const pinColor = (index: number) => {
    colors.value[index].locked = !colors.value[index].locked;
};
const editColor = (color: IColor, data: { hue: number; sat: number; val: number }) => {
    console.log(data, color);
    let hue = isNaN(data.hue) ? 0 : data.hue;
    color.hex = chroma(hue, data.sat, data.val, "hsv").hex();
    updateRoute();
};
const togglePicker = (id: number) => {
    if (openPickerId.value != id) {
        openPickerId.value = id;
    } else {
        openPickerId.value = -1;
    }
};
const generateAnalogousColors = (startColor: chroma.Color) => {
    // TODO: überarbeiten
    let startHue = startColor.get("hsl.h");
    let angles = [
        [startHue, startHue + 20, startHue + 40],
        [startHue, startHue - 20, startHue - 40],
    ];
    let angleArray = angles[Math.round(Math.random())];
    generateColorsWithFixedHueOffset(startColor, angleArray);
};
const generateMonochromaticColors = (startColor: chroma.Color) => {
    let startHue = startColor.get("hsl.h");
    let angleArray = [startHue];
    generateColorsWithFixedHueOffset(startColor, angleArray);
};
const generateComplementaryColors = (startColor: chroma.Color) => {
    let startHue = startColor.get("hsl.h");
    let angles = [
        [startHue, startHue + 180],
        [startHue, startHue - 180],
    ];
    let angleArray = angles[Math.round(Math.random())];
    generateColorsWithFixedHueOffset(startColor, angleArray);
};
const generateSplitComplementaryColors = (startColor: chroma.Color) => {
    let startHue = startColor.get("hsl.h");
    let angles = [
        [startHue, startHue + 171, startHue + 99],
        [startHue, startHue - 171, startHue - 99],
    ];
    let angleArray = angles[Math.round(Math.random())];
    generateColorsWithFixedHueOffset(startColor, angleArray);
};
const generateTriadicColors = (startColor: chroma.Color) => {
    let startHue = startColor.get("hsl.h");
    let angles = [
        [startHue, startHue + 120, startHue + 240],
        [startHue, startHue - 120, startHue - 240],
    ];
    let angleArray = angles[Math.round(Math.random())];
    generateColorsWithFixedHueOffset(startColor, angleArray);
};
const generateRandomColors = (startIndex: number) => {
    for (let k = startIndex; k < colors.value.length; k++) {
        let color = colors.value[k];
        if (!color.locked) {
            color.hex = chroma.random().hex();
        }
    }
};
const generateSquareColors = (startColor: chroma.Color) => {
    let startHue = startColor.get("hsl.h");
    let angles = [
        [startHue, startHue + 90, startHue + 180, startHue + 270],
        [startHue, startHue - 90, startHue - 180, startHue - 270],
    ];
    let angleArray = angles[Math.round(Math.random())];
    generateColorsWithFixedHueOffset(startColor, angleArray);
};
const generateTetradicColors = (startColor: chroma.Color) => {
    let startHue = startColor.get("hsl.h");
    let angles = [
        [startHue, 60 + startHue, 180 + startHue, 240 + startHue],
        [startHue, startHue - 60, startHue - 180, startHue - 240],
    ];
    let angleArray = angles[Math.round(Math.random())];
    generateColorsWithFixedHueOffset(startColor, angleArray);
};
const generateColorsWithFixedHueOffset = (startColor: chroma.Color, hues: Array<number>) => {
    for (let i = 0; i < unlockedColors.value.length; i++) {
        let color = unlockedColors.value[i];
        if (!color.locked) {
            let hue = startColor.get("hsl.h");
            if (i < hues.length) {
                hue = hues[i] % 360;
            } else {
                hue = hues[Math.round(Math.random() * hues.length - 1)] % 360;
            }
            let sat = Math.random();
            let lig = Math.random();
            color.hex = chroma(hue, sat, lig, "hsl").hex();
        }
    }
};
const generateWarmColors = (startIndex: number) => {
    if (lockedColors.value.length == 0) {
        startIndex = 0;
    }
    for (let k = startIndex; k < colors.value.length; k++) {
        let color = colors.value[k];
        if (!color.locked) {
            let hue = (Math.random() * 110 + 310) % 360;
            let sat = Math.random();
            let lig = Math.random();
            color.hex = chroma(hue, sat, lig, "hsl").hex();
        }
    }
};
const generateCoolColors = (startIndex: number) => {
    if (lockedColors.value.length == 0) {
        startIndex = 0;
    }
    for (let k = startIndex; k < colors.value.length; k++) {
        let color = colors.value[k];
        if (!color.locked) {
            let hue = (Math.random() * 250 + 60) % 360;
            let sat = Math.random();
            let lig = Math.random();
            color.hex = chroma(hue, sat, lig, "hsl").hex();
        }
    }
};
const generateColorsForSelectedHarmony = () => {
    // https://www.luminous-landscape.com/color-harmonies-4-cool-warm-split-tetradic-and-square/
    let startColor = null;
    const locked = lockedColors.value;
    let startIndex = 0;
    if (locked.length == 0) {
        startColor = chroma.random();
        colors.value[0].hex = startColor.hex();
        startIndex = 1;
    } else {
        let randIndex = Math.round(Math.random() * (locked.length - 1));
        startColor = chroma(locked[randIndex].hex);
    }
    switch (harmony.value) {
        case "auto":
            let prob = Math.random() * 10;
            if (prob < 1) {
                generateRandomColors(startIndex);
            } else if (prob < 2) {
                generateAnalogousColors(startColor);
            } else if (prob < 3) {
                generateTriadicColors(startColor);
            } else if (prob < 4) {
                generateTetradicColors(startColor);
            } else if (prob < 5) {
                generateComplementaryColors(startColor);
            } else if (prob < 6) {
                generateSplitComplementaryColors(startColor);
            } else if (prob < 7) {
                generateSquareColors(startColor);
            } else if (prob < 8) {
                generateWarmColors(startIndex);
            } else if (prob < 9) {
                generateCoolColors(startIndex);
            } else {
                generateMonochromaticColors(startColor);
            }
            break;
        case "random":
            generateRandomColors(startIndex);
            break;
        case "analogous":
            generateAnalogousColors(startColor);
            break;
        case "triadic":
            generateTriadicColors(startColor);
            break;
        case "tetradic":
            generateTetradicColors(startColor);
            break;
        case "complementary":
            generateComplementaryColors(startColor);
            break;
        case "split-complementary":
            generateSplitComplementaryColors(startColor);
            break;
        case "square":
            generateSquareColors(startColor);
            break;
        case "warm":
            generateWarmColors(startIndex);
            break;
        case "cool":
            generateCoolColors(startIndex);
            break;
        case "monochromatic":
            generateMonochromaticColors(startColor);
            break;
        default:
            break;
    }
    updateRoute();
};
const pinClasses = (locked: boolean) => {
    if (locked) {
        return "material-icons pinIcon";
    } else {
        return "material-icons-outlined pinIcon";
    }
};
const addColor = (index: number) => {
    if (colors.value.length < 10) {
        colors.value.splice(index, 0, {
            hashId: genRandHex(6),
            hex: chroma.random().hex(),
            locked: false,
        });
        updateRoute();
    }
};
const deleteColor = (index: number) => {
    if (colors.value.length > 1) {
        colors.value = colors.value.filter((col, i, arr) => {
            return index != i;
        });
        updateRoute();
    }
};
const updateRoute = () => {
    let queryString = colors.value.map((c) => c.hex.substring(1)).join("-");
    Router.push({ path: Router.currentRoute.value.path, query: { colors: queryString } });
};

const lockedColors = computed(() => colors.value.filter((color) => color.locked));
const unlockedColors = computed(() => colors.value.filter((color) => !color.locked));

onBeforeMount(() => {
    if (Router.currentRoute.value.query.colors == null) {
        generateColorsForSelectedHarmony();
    } else {
        if (typeof Router.currentRoute.value.query.colors !== "string") return;

        const colorsIn = Router.currentRoute.value.query.colors.split("-");
        colors.value = [];
        for (let i = 0; i < colorsIn.length; i++) {
            colors.value.push({
                hex: "#" + colorsIn[i].toUpperCase(),
                locked: false,
                hashId: genRandHex(6),
            });
        }
    }
});

onMounted(() => {
    document.addEventListener("keypress", (event) => {
        if (event.code == "Space") {
            generateColorsForSelectedHarmony();
        }
    });
});
</script>
<style scoped>
.palette {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100vh;
}

.settingsBar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    grid-gap: 6px;
    padding: 6px;

    border-bottom: var(--light-gray) solid 2px;
}

.paletteColors {
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow-x: auto;
}

.paletteColors > * {
    flex: 1;
}

.paletteColor {
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 170px;
}

.paletteColor * {
    color: inherit;
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

.addColorButton.moveRight {
    transform: translateX(50%);
}

.copyIcon,
.pinIcon,
.editIcon,
.deleteIcon {
    cursor: pointer;
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

    opacity: 0;
    pointer-events: none;

    z-index: 100;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

@media screen and (max-width: 768px) {
    .paletteColors {
        flex-direction: column;
    }

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
</style>
