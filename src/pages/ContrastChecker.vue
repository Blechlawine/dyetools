<template>
    <Head>
        <meta name="description" content="Check your colors for AA and AAA compatibility" />
        <meta property="og:description" content="Check your colors for AA and AAA compatibility" />
        <meta property="og:title" content="Dyetools - Contrast checker" />
        <title>Dyetools - {{ $t("contrast-checker.title") }}</title>
    </Head>
    <div class="checker">
        <div class="column">
            <h1 id="score">{{ score.toString().substring(0, 4) }}</h1>

            <div id="checks">
                <div class="checkmarkDiv">
                    <p>AA</p>
                    <Icon
                        size="xl"
                        :name="AApass ? 'i-tabler-check' : 'i-tabler-x'"
                        :style="aaColor"
                    ></Icon>
                </div>
                <div class="checkmarkDiv">
                    <p>AAA</p>
                    <Icon
                        size="xl"
                        :name="AAApass ? 'i-tabler-check' : 'i-tabler-x'"
                        :style="aaaColor"
                    ></Icon>
                </div>
                <div class="checkmarkDiv">
                    <p>AA Large</p>
                    <Icon
                        size="xl"
                        :name="AALargePass ? 'i-tabler-check' : 'i-tabler-x'"
                        :style="aaLargeColor"
                    ></Icon>
                </div>
                <div class="checkmarkDiv">
                    <p>AAA Large</p>
                    <Icon
                        size="xl"
                        :name="AAALargePass ? 'i-tabler-check' : 'i-tabler-x'"
                        :style="aaaLargeColor"
                    ></Icon>
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
    </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import ColorPickerBig from "../components/picker/ColorPickerBig.vue";
import chroma from "chroma-js";
import Icon from "../components/Icon.vue";
import { useI18n } from "vue-i18n";
import { type Quote } from "../types";
import { Head } from "@unhead/vue/components";

const { locale } = useI18n();

const quoteForeground = ref<Quote | null>(null);
const quoteBackground = ref<Quote | null>(null);
const AApass = ref(false);
const AAApass = ref(false);
const AALargePass = ref(false);
const AAALargePass = ref(false);

const allQuotes = ref<Quote[]>([]);

onMounted(() => {
    getQuotes();
});

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
    foregroundColor.h = hue;
    foregroundColor.s = sat;
    foregroundColor.v = val;
};
const onBackgroundColorChanged = ({ hue, sat, val }: { hue: number; sat: number; val: number }) => {
    backgroundColor.h = hue;
    backgroundColor.s = sat;
    backgroundColor.v = val;
};
const getQuotes = async () => {
    if (allQuotes.value.length === 0) {
        allQuotes.value = (await (await fetch(`/api/quotes-${locale.value}.json`)).json()).data;
    }
    quoteForeground.value = allQuotes.value[Math.floor(Math.random() * allQuotes.value.length)];
    quoteBackground.value = allQuotes.value[Math.floor(Math.random() * allQuotes.value.length)];
};

const foregroundChrome = computed(() =>
    chroma.hsv(foregroundColor.h, foregroundColor.s, foregroundColor.v),
);
const backgroundChrome = computed(() =>
    chroma.hsv(backgroundColor.h, backgroundColor.s, backgroundColor.v),
);
const foregroundColorText = computed(() => ({
    color: foregroundChrome.value.css(),
}));
const backgroundColorText = computed(() => ({
    color: backgroundChrome.value.css(),
}));
const foregroundColorBackground = computed(() => ({
    "background-color": foregroundChrome.value.css(),
}));
const backgroundColorBackground = computed(() => ({
    "background-color": backgroundChrome.value.css(),
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
    const c1: { [k: string]: number } = {
        r: backgroundChrome.value.get("rgb.r") / 255,
        g: backgroundChrome.value.get("rgb.g") / 255,
        b: backgroundChrome.value.get("rgb.b") / 255,
    };
    const c2: { [k: string]: number } = {
        r: foregroundChrome.value.get("rgb.r") / 255,
        g: foregroundChrome.value.get("rgb.g") / 255,
        b: foregroundChrome.value.get("rgb.b") / 255,
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

    const score = (l1 + 0.05) / (l2 + 0.05);

    AApass.value = score > 4.5;
    AALargePass.value = score > 3;
    AAApass.value = score > 7;
    AAALargePass.value = score > 4.5;

    return score;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.column {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 40px;
}

.checker {
    margin-bottom: 10vh;
    position: relative;
}

@media screen and (min-width: 1500px) {
    #pickerBox {
        position: absolute;
        bottom: 0;
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
