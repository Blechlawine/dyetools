<template>
    <div class="colorPicker" :style="colorPickerResponsiveStyles">
        <div class="topPart" :style="topBottomResponsiveStyles">
            <div class="horizontalFlex">
                <span v-if="closable" class="material-icons" @click="">close</span>
            </div>
            <SatValPicker
                :saturationIn="sat"
                :valueIn="val"
                :hue="hue"
                :saturation="sat"
                :value="val"
                @satValChanged="satValChanged"
                @changeEnd="changeEnd"
            />
            <HueSlider
                :handlePosition="hueSliderHandlePosition"
                :model-value="hue"
                @update:model-value="hueChanged"
                @changeEnd="changeEnd"
            />
        </div>
        <div v-if="winHeight <= 768 && responsive" class="verticalDivider"></div>
        <div v-else class="horizontalDivider"></div>
        <div class="bottomPart" :style="topBottomResponsiveStyles">
            <div class="horizontalFlex">
                <Dropdown :values="sliderModes" @select="activeMode = $event" />
                <CopyField :value="copyValue" />
            </div>
            <div class="horizontalDivider"></div>
            <!-- Slider Collection -->
            <RGBSliderCollection
                v-if="sliderMode === 'rgb'"
                :red="chrome.get('rgb.r')"
                :green="chrome.get('rgb.g')"
                :blue="chrome.get('rgb.b')"
                @change="sliderChanged"
                @change-end="changeEnd"
            ></RGBSliderCollection>
            <CMYKSliderCollection
                v-else-if="sliderMode === 'cmyk'"
                :cyan="chrome.get('cmyk.c')"
                :magenta="chrome.get('cmyk.m')"
                :yellow="chrome.get('cmyk.y')"
                :k="chrome.get('cmyk.k')"
                @change="sliderChanged"
                @change-end="changeEnd"
            >
            </CMYKSliderCollection>
            <HSLSliderCollection
                v-else-if="sliderMode === 'hsl'"
                :hue="chrome.get('hsl.h')"
                :saturation="chrome.get('hsl.s')"
                :lightness="chrome.get('hsl.l')"
                @change="sliderChanged"
                @change-end="changeEnd"
            >
            </HSLSliderCollection>
            <LABSliderCollection
                v-else-if="sliderMode === 'lab'"
                :l="chrome.get('lab.l')"
                :a="chrome.get('lab.a')"
                :b="chrome.get('lab.b')"
                @change="sliderChanged"
                @change-end="changeEnd"
            >
            </LABSliderCollection>
            <TextInput
                v-else-if="sliderMode === 'hex'"
                placeholder="#FFFFFF"
                :valid="hexBoxValid"
                :model-value="chrome.hex().toUpperCase()"
                @update:model-value="textIn"
            ></TextInput>
            <Swatches
                v-else
                :type="sliderMode"
                :trigger-sort="triggerSort"
                :hex="chrome.hex()"
                @change="textIn"
            ></Swatches>
        </div>
    </div>
</template>
<script setup lang="ts">
import Dropdown from "../inputs/Dropdown.vue";
import CopyField from "../inputs/CopyField.vue";
import SatValPicker from "./SatValPicker.vue";
import HueSlider from "../inputs/slider/HueSlider.vue";
import TextInput from "../inputs/TextInput.vue";
import RGBSliderCollection from "../inputs/slider/collections/RGBSliderCollection.vue";
import CMYKSliderCollection from "../inputs/slider/collections/CMYKSliderCollection.vue";
import HSLSliderCollection from "../inputs/slider/collections/HSLSliderCollection.vue";
import LABSliderCollection from "../inputs/slider/collections/LABSliderCollection.vue";
import Swatches from "./Swatches.vue";
import chroma from "chroma-js";
import { computed, onMounted, ref, watch } from "vue";

const sliderModes = ["RGB", "HSL", "CMYK", "LAB", "Copic", "RAL", "HKS", "Name", "HEX", "Pantone"];
interface ISliderCollectionChangeEventPayload {
    red?: number;
    green?: number;
    blue?: number;
    c?: number;
    m?: number;
    y?: number;
    k?: number;
    hue?: number;
    saturation?: number;
    lightness?: number;
    l?: number;
    a?: number;
    b?: number;
}
const emit = defineEmits<{
    (e: "colorChange", color: { hue: number; sat: number; val: number }): void;
    (e: "changeEnd"): void;
}>();

const props = defineProps({
    hueIn: {
        type: Number,
        default: 0,
    },
    satIn: {
        type: Number,
        default: 1,
    },
    valIn: {
        type: Number,
        default: 1,
    },
    closable: {
        type: Boolean,
        default: false,
    },
    responsive: {
        type: Boolean,
        default: false,
    },
});

watch(
    () => props.hueIn,
    () => {
        hue.value = props.hueIn;
        triggerSort.value++;
    }
);
watch(
    () => props.satIn,
    () => {
        sat.value = props.satIn;
        triggerSort.value++;
    }
);
watch(
    () => props.valIn,
    () => {
        val.value = props.valIn;
        triggerSort.value++;
    }
);

const hueSliderHandlePosition = ref(0);
const satValPickerPosX = ref(0);
const satValPickerPosY = ref(0);

const winHeight = ref(0);
const hue = ref(props.hueIn);
const sat = ref(props.satIn);
const val = ref(props.valIn);
const activeMode = ref(0);
const hexBoxValid = ref(true);
const triggerSort = ref(0);

const sliderMode = computed(() => sliderModes[activeMode.value].toLowerCase());
const chrome = computed(() => chroma.hsv(hue.value, sat.value, val.value));
const copyValue = computed(() => {
    if (sliderMode.value === "rgb") {
        return chroma.hsv(hue.value, sat.value, val.value).css();
    } else if (sliderMode.value === "hsl") {
        let hslSat = Math.round(chroma.hsv(hue.value, sat.value, val.value).get("hsl.s") * 100);
        let hslLig = Math.round(chroma.hsv(hue.value, sat.value, val.value).get("hsl.l") * 100);
        return `hsl(${Math.round(hue.value)}, ${hslSat}%, ${hslLig}%)`;
    } else {
        return chroma.hsv(hue.value, sat.value, val.value).hex().toUpperCase();
    }
});
const colorPickerResponsiveStyles = computed(() => ({
    "flex-direction": props.responsive && winHeight.value <= 768 ? ("row" as "row") : ("unset" as "unset"), // wtf is this? why can it not infer the literal type
    width: props.responsive && winHeight.value <= 768 ? 345 * 2 : 345,
    height: props.responsive && winHeight.value <= 768 ? 298 : undefined,
}));
const topBottomResponsiveStyles = computed(() => ({
    width: props.responsive && winHeight.value <= 768 ? "345px" : "",
}));

onMounted(() => {
    emit("colorChange", {
        hue: hue.value,
        sat: sat.value,
        val: val.value,
    });
    winHeight.value = window.innerHeight;
    window.addEventListener("resize", () => {
        winHeight.value = window.innerHeight;
    });
});

const hueChanged = (h: number) => {
    hue.value = Math.round(h);
    emit("colorChange", {
        hue: hue.value,
        sat: sat.value,
        val: val.value,
    });
};
const satValChanged = (s: number, v: number) => {
    sat.value = s;
    val.value = v;
    emit("colorChange", {
        hue: hue.value,
        sat: sat.value,
        val: val.value,
    });
};
const sliderChanged = (value: ISliderCollectionChangeEventPayload) => {
    let chrome: chroma.Color | null = null;
    if (value.red != undefined && value.green != undefined && value.blue != undefined) {
        chrome = chroma.rgb(value.red, value.green, value.blue);
    } else if (value.hue != undefined && value.saturation != undefined && value.lightness != undefined) {
        chrome = chroma.hsl(value.hue, value.saturation / 100, value.lightness / 100);
    } else if (value.c != undefined && value.m != undefined && value.y != undefined && value.k != undefined) {
        chrome = chroma.cmyk(value.c / 100, value.m / 100, value.y / 100, value.k / 100);
    } else if (value.l != undefined && value.a != undefined && value.b != undefined) {
        chrome = chroma.lab(value.l, value.a, value.b);
    }
    let h = chrome?.get("hsv.h");
    hue.value = (isNaN(h ?? 0) ? 0 : h) ?? hue.value;
    sat.value = chrome?.get("hsv.s") ?? sat.value;
    val.value = chrome?.get("hsv.v") ?? val.value;
    emit("colorChange", {
        hue: hue.value,
        sat: sat.value,
        val: val.value,
    });
};
const textIn = (value: string) => {
    hexBoxValid.value = checkHex(value);
    if (hexBoxValid.value) {
        let text = value.replace(/(0[xX]|#)/, "");
        let chrome = chroma(text);
        let h = chrome.get("hsv.h");
        hue.value = isNaN(h) ? 0 : h;
        sat.value = chrome.get("hsv.s");
        val.value = chrome.get("hsv.v");
        emit("colorChange", {
            hue: hue.value,
            sat: sat.value,
            val: val.value,
        });
        changeEnd();
    }
};
const checkHex = (value: string) => {
    if (value.startsWith("#")) {
        value = value.substring(1);
    }
    return !/^(0[xX]|#|)([a-fA-F0-9]{6})$/.test(value);
};
const changeEnd = () => {
    triggerSort.value++;
    emit("changeEnd");
};
</script>
<style scoped>
.colorPicker {
    padding: 12px;
    border-radius: 12px;
    box-shadow: var(--shadow4px);
    color: var(--textColor);
    text-align: left;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    grid-gap: 8px;

    background-color: var(--background);
}

.sliderpartpart p {
    -webkit-user-select: none;
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.topPart,
.bottomPart {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 8px;
}
</style>
