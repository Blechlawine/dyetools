<template>
    <div class="colorPicker" :style="colorPickerResponsiveStyles">
        <div class="topPart" :style="topBottomResponsiveStyles">
            <div class="horizontalFlex">
                <span v-if="closable" class="material-icons" @click="emit('close')">close</span>
            </div>
            <SatValPicker
                :saturation="_hsv.s"
                :value="_hsv.v"
                :hue="_hsv.h"
                @change="satValChanged"
                @changeEnd="changeEnd"
            />
            <HueSlider
                :handlePosition="hueSliderHandlePosition"
                :model-value="_hsv.h"
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
                :red="_rgb.r"
                :green="_rgb.g"
                :blue="_rgb.b"
                @change="sliderChanged"
                @change-end="changeEnd"
            ></RGBSliderCollection>
            <CMYKSliderCollection
                v-else-if="sliderMode === 'cmyk'"
                :cyan="_cmyk.c * 100"
                :magenta="_cmyk.m * 100"
                :yellow="_cmyk.y * 100"
                :k="_cmyk.k * 100"
                @change="sliderChanged"
                @change-end="changeEnd"
            >
            </CMYKSliderCollection>
            <HSLSliderCollection
                v-else-if="sliderMode === 'hsl'"
                :hue="isNaN(_hsl.h) ? 0 : _hsl.h"
                :saturation="_hsl.s * 100"
                :lightness="_hsl.l * 100"
                @change="sliderChanged"
                @change-end="changeEnd"
            >
            </HSLSliderCollection>
            <LABSliderCollection
                v-else-if="sliderMode === 'lab'"
                :l="_lab.l"
                :a="_lab.a"
                :b="_lab.b"
                @change="sliderChanged"
                @change-end="changeEnd"
            >
            </LABSliderCollection>
            <div class="horizontalFlex" v-else-if="sliderMode === 'hex'">
                <TextInput placeholder="#FFFFFF" :valid="hexBoxValid" v-model="hexValue"></TextInput>
                <Button @click="textIn">Ok</Button>
            </div>
            <!-- TODO: DOESNT WORK -->
            <!-- <Swatches
                v-else
                :type="sliderMode"
                :trigger-sort="triggerSort"
                :hex="chrome.hex()"
                @change="textIn"
            ></Swatches> -->
        </div>
    </div>
</template>
<script setup lang="ts">
import Dropdown from "../inputs/Dropdown.vue";
import CopyField from "../inputs/CopyField.vue";
import SatValPicker from "./SatValPicker.vue";
import HueSlider from "../inputs/slider/HueSlider.vue";
import TextInput from "../inputs/TextInput.vue";
import Button from "../button/Button.vue";
import RGBSliderCollection from "../inputs/slider/collections/RGBSliderCollection.vue";
import CMYKSliderCollection from "../inputs/slider/collections/CMYKSliderCollection.vue";
import HSLSliderCollection from "../inputs/slider/collections/HSLSliderCollection.vue";
import LABSliderCollection from "../inputs/slider/collections/LABSliderCollection.vue";
import Swatches from "./Swatches.vue";
import chroma from "chroma-js";
import { computed, nextTick, onMounted, reactive, ref, watch, WritableComputedRef } from "vue";

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
    (e: "change", color: { hue: number; sat: number; val: number }): void;
    (e: "changeEnd"): void;
    (e: "close"): void;
}>();

const props = defineProps({
    hue: {
        type: Number,
        default: 0,
    },
    sat: {
        type: Number,
        default: 1,
    },
    val: {
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

const _rgb = reactive({
    r: chroma.hsv(props.hue, props.sat, props.val).get("rgb.r"),
    g: chroma.hsv(props.hue, props.sat, props.val).get("rgb.g"),
    b: chroma.hsv(props.hue, props.sat, props.val).get("rgb.b"),
});
const _hsl = reactive({
    h: chroma.hsv(props.hue, props.sat, props.val).get("hsl.h"),
    s: chroma.hsv(props.hue, props.sat, props.val).get("hsl.s"),
    l: chroma.hsv(props.hue, props.sat, props.val).get("hsl.l"),
});
const _hsv = reactive({
    h: props.hue,
    s: props.sat,
    v: props.val,
});
const _cmyk = reactive({
    c: chroma.hsv(props.hue, props.sat, props.val).get("cmyk.c"),
    m: chroma.hsv(props.hue, props.sat, props.val).get("cmyk.m"),
    y: chroma.hsv(props.hue, props.sat, props.val).get("cmyk.y"),
    k: chroma.hsv(props.hue, props.sat, props.val).get("cmyk.k"),
});
const _lab = reactive({
    l: chroma.hsv(props.hue, props.sat, props.val).get("lab.l"),
    a: chroma.hsv(props.hue, props.sat, props.val).get("lab.a"),
    b: chroma.hsv(props.hue, props.sat, props.val).get("lab.b"),
});

watch(
    () => [props.hue, props.sat, props.val],
    () => {
        _hsv.h = props.hue;
        _hsv.s = props.sat;
        _hsv.v = props.val;
        updateSlidersFromHSV();
        triggerSort.value++;
    },
    {
        deep: true,
    }
);

const hueSliderHandlePosition = ref(0);
const winHeight = ref(0);
const activeMode = ref(0);
const triggerSort = ref(0);

const hexBoxValid = computed(() => checkHex(hexValue.value));

const sliderMode = computed(() => sliderModes[activeMode.value].toLowerCase());

const chrome = computed(() => {
    switch (sliderMode.value) {
        case "hsl":
            return chroma.hsl(_hsl.h, _hsl.s, _hsl.l);
        case "cmyk":
            return chroma.cmyk(_cmyk.c, _cmyk.m, _cmyk.y, _cmyk.k);
        case "rgb":
            return chroma.rgb(_rgb.r, _rgb.g, _rgb.b);
        case "lab":
            return chroma.lab(_lab.l, _lab.a, _lab.b);
        default:
            return chroma.hsv(props.hue, props.sat, props.val);
    }
});

const hexValue = ref(chrome.value.hex());
const copyValue = computed(() => {
    if (sliderMode.value === "rgb") {
        return chrome.value.css();
    } else if (sliderMode.value === "hsl") {
        let hslSat = Math.round(chrome.value.get("hsl.s") * 100);
        let hslLig = Math.round(chrome.value.get("hsl.l") * 100);
        return `hsl(${Math.round(_hsl.h)}, ${hslSat}%, ${hslLig}%)`;
    } else {
        return hexValue.value.toUpperCase();
    }
});
const colorPickerResponsiveStyles = computed(() => ({
    "flex-direction": props.responsive && winHeight.value <= 768 ? ("row" as "row") : ("column" as "column"), // wtf is this? why can it not infer the literal type
    width: props.responsive && winHeight.value <= 768 ? "calc(345px * 2)" : "345px",
    height: props.responsive && winHeight.value <= 768 ? "298px" : "",
}));
const topBottomResponsiveStyles = computed(() => ({
    width: props.responsive && winHeight.value <= 768 ? "345px" : "",
}));

onMounted(() => {
    winHeight.value = window.innerHeight;
    window.addEventListener("resize", () => {
        winHeight.value = window.innerHeight;
    });
});

const updateSlidersFromHSV = () => {
    let c = chroma.hsv(_hsv.h, _hsv.s, _hsv.v);
    // RGB
    _rgb.r = c.get("rgb.r");
    _rgb.g = c.get("rgb.g");
    _rgb.b = c.get("rgb.b");
    // HSL
    _hsl.h = c.get("hsl.h");
    _hsl.s = c.get("hsl.s");
    _hsl.l = c.get("hsl.l");
    // CMYK
    _cmyk.c = c.get("cmyk.c");
    _cmyk.m = c.get("cmyk.m");
    _cmyk.y = c.get("cmyk.y");
    _cmyk.k = c.get("cmyk.k");
    // LAB
    _lab.l = c.get("lab.l");
    _lab.a = c.get("lab.a");
    _lab.b = c.get("lab.b");

    hexValue.value = c.hex().toUpperCase();
    emit("change", {
        hue: _hsv.h,
        sat: _hsv.s,
        val: _hsv.v,
    });
};

const hueChanged = (h: number) => {
    _hsv.h = Math.round(h);
    nextTick(updateSlidersFromHSV);
};
const satValChanged = ({ s, v }: { s: number; v: number }) => {
    _hsv.s = s;
    _hsv.v = v;
    nextTick(updateSlidersFromHSV);
};
const sliderChanged = (value: ISliderCollectionChangeEventPayload) => {
    if (value.red !== undefined && value.green !== undefined && value.blue !== undefined) {
        _rgb.r = value.red;
        _rgb.g = value.green;
        _rgb.b = value.blue;
    } else if (value.hue !== undefined && value.saturation !== undefined && value.lightness !== undefined) {
        _hsl.h = value.hue;
        _hsl.s = value.saturation / 100;
        _hsl.l = value.lightness / 100;
    } else if (value.c !== undefined && value.m !== undefined && value.y !== undefined && value.k !== undefined) {
        _cmyk.c = value.c / 100;
        _cmyk.m = value.m / 100;
        _cmyk.y = value.y / 100;
        _cmyk.k = value.k / 100;
    } else if (value.l !== undefined && value.a !== undefined && value.b !== undefined) {
        _lab.l = value.l;
        _lab.a = value.a;
        _lab.b = value.b;
    }
    let h = chrome.value.get("hsv.h");
    _hsv.h = (isNaN(h ?? 0) ? 0 : h) ?? _hsv.h;
    _hsv.s = chrome.value.get("hsv.s") ?? _hsv.s;
    _hsv.v = chrome.value.get("hsv.v") ?? _hsv.v;
    hexValue.value = chrome.value.hex().toUpperCase();
    if (sliderMode.value !== "rgb") {
        // RGB
        _rgb.r = chrome.value.get("rgb.r");
        _rgb.g = chrome.value.get("rgb.g");
        _rgb.b = chrome.value.get("rgb.b");
    }
    if (sliderMode.value !== "hsl") {
        // HSL
        _hsl.h = chrome.value.get("hsl.h");
        _hsl.s = chrome.value.get("hsl.s");
        _hsl.l = chrome.value.get("hsl.l");
    }
    if (sliderMode.value !== "cmyk") {
        // CMYK
        _cmyk.c = chrome.value.get("cmyk.c");
        _cmyk.m = chrome.value.get("cmyk.m");
        _cmyk.y = chrome.value.get("cmyk.y");
        _cmyk.k = chrome.value.get("cmyk.k");
    }
    if (sliderMode.value !== "lab") {
        // LAB
        _lab.l = chrome.value.get("lab.l");
        _lab.a = chrome.value.get("lab.a");
        _lab.b = chrome.value.get("lab.b");
    }
    // HSV
    _hsv.h = chrome.value.get("hsv.h");
    _hsv.s = chrome.value.get("hsv.s");
    _hsv.v = chrome.value.get("hsv.v");
    emit("change", {
        hue: _hsv.h,
        sat: _hsv.s,
        val: _hsv.v,
    });
};
const textIn = () => {
    if (hexBoxValid.value) {
        let text = hexValue.value.replace(/(0[xX]|#)/, "");
        let c = chroma(text);
        let h = c.get("hsv.h");
        _hsv.h = isNaN(h) ? 0 : h;
        _hsv.s = c.get("hsv.s");
        _hsv.v = c.get("hsv.v");
        updateSlidersFromHSV();
        changeEnd();
    }
};
const checkHex = (value: string) => {
    if (value.startsWith("#")) {
        value = value.substring(1);
    }
    return !/^(0[xX]|#|)([a-fA-F0-9]{7})$/.test(value);
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

.topPart,
.bottomPart {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 8px;
}

.sliderCollection {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>