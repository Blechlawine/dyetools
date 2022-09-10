<template>
    <teleport to="head">
        <meta name="description" content="Check your colors for AA and AAA compatibility" />
        <meta property="og:description" content="Check your colors for AA and AAA compatibility" />
        <meta property="og:title" content="Dyetools - Contrast checker" />
        <title>Dyetools - Contrast checker</title>
    </teleport>
    <div class="column">
        <h1 id="score">{{ score.toString().substring(0, 4) }}</h1>

        <div id="checks">
            <div class="checkmarkDiv">
                <p>AA</p>
                <span class="material-icons" :style="aaColor">{{ AApass ? "done" : "close" }}</span>
            </div>
            <div class="checkmarkDiv">
                <p>AAA</p>
                <span class="material-icons" :style="aaaColor">{{ AAApass ? "done" : "close" }}</span>
            </div>
            <div class="checkmarkDiv">
                <p>AA Large</p>
                <span class="material-icons" :style="aaLargeColor">{{ AALargePass ? "done" : "close" }}</span>
            </div>
            <div class="checkmarkDiv">
                <p>AAA Large</p>
                <span class="material-icons" :style="aaaLargeColor">{{ AAALargePass ? "done" : "close" }}</span>
            </div>
        </div>

        <div class="colors">
            <div class="foregroundColor" :style="foregroundColorBackground">
                <input
                    type="text"
                    class="largeExampleInput"
                    :value="quoteForeground?.groot ?? ''"
                    :style="backgroundColorText"
                    id="backgroundLargeInput"
                />
                <textarea
                    type="text"
                    class="smallExampleInput"
                    :value="quoteForeground?.quote ?? ''"
                    :style="backgroundColorText"
                    id="backgroundSmallInput"
                ></textarea>
            </div>
            <div class="backgroundColor" :style="backgroundColorBackground">
                <input
                    type="text"
                    class="largeExampleInput"
                    :value="quoteBackground?.groot ?? ''"
                    :style="foregroundColorText"
                    id="foregroundLargeInput"
                />
                <textarea
                    type="text"
                    class="smallExampleInput"
                    :value="quoteBackground?.quote ?? ''"
                    :style="foregroundColorText"
                    id="foregroundSmallInput"
                ></textarea>
            </div>
        </div>
    </div>
    <div class="horizontalFlex" id="pickerBox">
        <div class="column">
            <ColorPickerBig
                :hue="foregroundColor.h"
                :sat="foregroundColor.s"
                :val="foregroundColor.v"
                id="foregroundPicker"
                class="colorPickerBig"
                @change="onForegroundColorChanged"
            />
        </div>
        <div class="column">
            <ColorPickerBig
                :hue="backgroundColor.h"
                :sat="backgroundColor.s"
                :val="backgroundColor.v"
                id="backgroundPicker"
                class="colorPickerBig"
                @change="onBackgroundColorChanged"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import ColorPickerBig from "../components/picker/ColorPickerBig.vue";
import chroma from "chroma-js";
const quoteForeground = ref<IQuote | null>(null);
const quoteBackground = ref<IQuote | null>(null);
const AApass = ref(false);
const AAApass = ref(false);
const AALargePass = ref(false);
const AAALargePass = ref(false);

const foregroundColor = reactive({
    h: Math.random() * 360,
    s: Math.random(),
    v: Math.random(),
});

const backgroundColor = reactive({
    h: Math.random() * 360,
    s: Math.random(),
    v: Math.random(),
});

const onForegroundColorChanged = ({ hue, sat, val }: { hue: number; sat: number; val: number }) => {
    foregroundColor.h = sat;
    foregroundColor.s = hue;
    foregroundColor.v = val;
};
const onBackgroundColorChanged = ({ hue, sat, val }: { hue: number; sat: number; val: number }) => {
    backgroundColor.h = sat;
    backgroundColor.s = hue;
    backgroundColor.v = val;
};
const getQuotes = async () => {
    // TODO: redo with new api
    let data = await fetch("/api/quotes");
    quoteForeground.value = await data.json();
    let data2 = await fetch("/api/quotes");
    quoteBackground.value = await data2.json();
};

const foregroundColorText = computed(() => ({
    color: chroma.hsv(foregroundColor.h, foregroundColor.s, foregroundColor.v).css(),
}));
const backgroundColorText = computed(() => ({
    color: chroma.hsv(backgroundColor.h, backgroundColor.s, backgroundColor.v).css(),
}));
const foregroundColorBackground = computed(() => ({
    "background-color": chroma.hsv(foregroundColor.h, foregroundColor.s, foregroundColor.v).css(),
}));
const backgroundColorBackground = computed(() => ({
    "background-color": chroma.hsv(backgroundColor.h, backgroundColor.s, backgroundColor.v).css(),
}));
const aaColor = computed(() => ({
    color: AApass.value ? "#4CAF50" : "#E35141",
}));
const aaaColor = computed(() => ({
    color: AAApass.value ? "#4CAF50" : "#E35141",
}));
const aaLargeColor = computed(() => ({
    color: AALargePass.value ? "#4CAF50" : "#E35141",
}));
const aaaLargeColor = computed(() => ({
    color: AAALargePass.value ? "#4CAF50" : "#E35141",
}));
const score = computed(() => {
    let rgb1 = chroma.hsv(backgroundColor.h, backgroundColor.s, backgroundColor.v);
    let rgb2 = chroma.hsv(foregroundColor.h, foregroundColor.s, foregroundColor.v);

    const c1: { [k: string]: number } = {
        r: rgb1.get("rgb.r") / 255,
        g: rgb1.get("rgb.g") / 255,
        b: rgb1.get("rgb.b") / 255,
    };
    const c2: { [k: string]: number } = {
        r: rgb2.get("rgb.r") / 255,
        g: rgb2.get("rgb.g") / 255,
        b: rgb2.get("rgb.b") / 255,
    };

    let c1final: { [k: string]: number | null } = {
        r: null,
        g: null,
        b: null,
    };

    let c2final: { [k: string]: number | null } = {
        r: null,
        g: null,
        b: null,
    };

    for (const [key, value] of Object.entries(c1)) {
        if (value <= 0.03928) {
            c1final[key] = value / 12.92;
        } else {
            c1final[key] = Math.pow((value + 0.055) / 1.055, 2.4);
        }
    }

    for (const [key, value] of Object.entries(c2)) {
        if (value <= 0.03928) {
            c2final[key] = value / 12.92;
        } else {
            c2final[key] = Math.pow((value + 0.055) / 1.055, 2.4);
        }
    }

    let l1 = 0.2126 * c1final.r! + 0.7152 * c1final.g! + 0.0722 * c1final.b!;
    let l2 = 0.2126 * c2final.r! + 0.7152 * c2final.g! + 0.0722 * c2final.b!;

    if (l1 < l2) {
        let temp = l1;
        l1 = l2;
        l2 = temp;
    }

    const passed = (l1 + 0.05) / (l2 + 0.05);

    AApass.value = passed > 4.5;
    AALargePass.value = passed > 3;
    AAApass.value = passed > 7;
    AAALargePass.value = passed > 4.5;

    return passed;
});
</script>
<style scoped>
.colors {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    height: 33vh;
    width: 50vw;
}

.foregroundColor {
    border-radius: 12px 0 0 12px;
}

.backgroundColor {
    border-radius: 0 12px 12px 0;
}

.foregroundColor,
.backgroundColor {
    padding: 24px;

    height: 100%;
    width: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    grid-gap: 24px;
}

input[type="text"],
textarea {
    border: none;
    outline: none;
    resize: none;

    text-align: center;

    background: transparent;
}

textarea {
    width: 60%;
    height: 50%;
    overflow-x: hidden;
}

.largeExampleInput {
    font-size: 24px;
}

#foregroundPicker {
    margin-left: 2vw;
}
#backgroundPicker {
    margin-right: 2vw;
}

.colorPickerBig {
    margin-top: 200px;
}

#score {
    text-align: center;
    margin-top: 60px;
    font-size: 120px;
    font-weight: 400;
}

#checks {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.checkmarkDiv {
    width: 10ch;
    text-align: center;
    display: flex;
    flex-direction: column;
    grid-gap: 8px;
}

.checkmarkDiv .material-icons {
    font-size: 48px;
}

.column {
    display: flex;
    flex-direction: column;
    align-items: center;

    grid-gap: 40px;
}

@media screen and (min-width: 1500px) {
    #pickerBox {
        position: absolute;
        top: 0;
    }
}

@media screen and (max-width: 1500px) {
    .colors {
        width: 100%;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        grid-gap: 12px;
    }

    .horizontalFlex {
        grid-gap: 12px;
        justify-content: center;
    }

    #foregroundPicker {
        margin-left: 0;
    }
    #backgroundPicker {
        margin-right: 0;
    }

    .colorPickerBig {
        margin-top: 0;
    }
}
</style>