<template>
    <Head>
        <meta name="description" content="Convert colors into many formats" />
        <meta property="og:description" content="Convert colors into many formats" />
        <meta property="og:title" content="Dyetools - Color converter" />
        <title>Dyetools - {{ $t("converter.title") }}</title>
    </Head>
    <div class="content">
        <div class="column" id="pickerColumn">
            <ColorPickerBig
                :hue="hsv.h"
                :sat="hsv.s"
                :val="hsv.v"
                @change="updateColor($event)"
                @changeEnd="updateColorName"
            />
        </div>
        <div class="column" id="colorColumn">
            <h2>{{ $t("converter.subtitle.color") }}</h2>
            <div id="color" :style="colorBackground">
                <p class="centeredText" :style="optimalTextColor">{{ colorName }}</p>
            </div>
            <h2>{{ $t("converter.subtitle.adjustments") }}</h2>
            <div class="sliderpartParent" :style="lightenedBackground">
                <Sliderpart
                    :label="$t('converter.adjustments.lighten')"
                    :min="0"
                    :max="100"
                    v-model="lightenValue"
                    :coloredBackground="true"
                    :background="lightenedCss"
                    :handleBackground="lightenedCss"
                    :sliderBackground="lightenedSliderBackground"
                />
                <div class="horizontalFlex">
                    <CopyField :value="lightenedChrome.hex().toUpperCase()" />
                    <Button @click="lightenClicked">{{ $t("common.actions.apply") }}</Button>
                </div>
            </div>
            <div class="sliderpartParent" :style="darkenedBackground">
                <Sliderpart
                    :label="$t('converter.adjustments.darken')"
                    :min="0"
                    :max="100"
                    v-model="darkenValue"
                    :coloredBackground="true"
                    :background="darkenedCss"
                    :handleBackground="darkenedCss"
                    :sliderBackground="darkenedSliderBackground"
                />
                <div class="horizontalFlex">
                    <CopyField :value="darkenedChrome.hex().toUpperCase()" />
                    <Button @click="darkenClicked">{{ $t("common.actions.apply") }}</Button>
                </div>
            </div>
            <div class="sliderpartParent" :style="saturatedBackground">
                <Sliderpart
                    :label="$t('converter.adjustments.saturate')"
                    :min="0"
                    :max="100"
                    v-model="saturateValue"
                    :coloredBackground="true"
                    :background="saturatedCss"
                    :handleBackground="saturatedCss"
                    :sliderBackground="saturatedSliderBackground"
                />
                <div class="horizontalFlex">
                    <CopyField :value="saturatedChrome.hex().toUpperCase()" />
                    <Button @click="saturateClicked">{{ $t("common.actions.apply") }}</Button>
                </div>
            </div>
            <div class="sliderpartParent" :style="desaturatedBackground">
                <Sliderpart
                    :label="$t('converter.adjustments.desaturate')"
                    :min="0"
                    :max="100"
                    v-model="desaturateValue"
                    :coloredBackground="true"
                    :background="desaturatedCss"
                    :handleBackground="desaturatedCss"
                    :sliderBackground="desaturatedSliderBackground"
                />
                <div class="horizontalFlex">
                    <CopyField :value="desaturatedChrome.hex().toUpperCase()" />
                    <Button @click="desaturateClicked">{{ $t("common.actions.apply") }}</Button>
                </div>
            </div>
        </div>
        <div class="column" id="convertedColumn">
            <h2>{{ $t("converter.subtitle.converted") }}</h2>
            <div id="copyFields">
                <CopyField :value="hex" />
                <CopyField :value="rgb" />
                <CopyField :value="hsl" />
                <CopyField :value="cmyk" />
                <CopyField :value="lab" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import CopyField from "../components/inputs/CopyField.vue";
import Button from "../components/button/Button.vue";
import Sliderpart from "../components/inputs/slider/collections/SliderPart.vue";
import ColorPickerBig from "../components/picker/ColorPickerBig.vue";
import { computed, onMounted, reactive, ref } from "vue";
import chroma from "chroma-js";
import { scale } from "../utils";
import { Head } from "@unhead/vue/components";

onMounted(() => {
    fetchNames();
});

const hsv = reactive({
    h: Math.random() * 360,
    s: Math.random(),
    v: Math.random(),
});
const names = ref<{ name: string; hex: string }[]>([]);
const desaturateValue = ref(50);
const saturateValue = ref(50);
const darkenValue = ref(50);
const lightenValue = ref(50);

const chrome = computed(() => chroma.hsv(hsv.h, hsv.s, hsv.v));
const hex = computed(() => chrome.value.hex().toUpperCase());
const rgb = computed(() => chrome.value.css());
const hsl = computed(() => chrome.value.css("hsl"));
const cmyk = computed(() => {
    const cmykC = Math.round(chrome.value.get("cmyk.c") * 100);
    const cmykM = Math.round(chrome.value.get("cmyk.m") * 100);
    const cmykY = Math.round(chrome.value.get("cmyk.y") * 100);
    const cmykK = Math.round(chrome.value.get("cmyk.k") * 100);
    return `cmyk(${cmykC}, ${cmykM}, ${cmykY}, ${cmykK})`;
});
const lab = computed(() => {
    const labL = Math.round(chrome.value.get("lab.l"));
    const labA = Math.round(chrome.value.get("lab.a"));
    const labB = Math.round(chrome.value.get("lab.b"));
    return `lab(${labL}, ${labA}, ${labB})`;
});
const brightText = computed(() => chrome.value.luminance() < 0.5);
const colorName = computed(() => names.value[0]?.name || "");

const optimalTextColor = computed(() => ({
    color: brightText.value ? "var(--text-white)" : "var(--text-dark)",
}));
const desaturatedChrome = computed(() =>
    chroma.hsv(hsv.h, hsv.s - scale(desaturateValue.value, 0, 100, 0, hsv.s), hsv.v),
);
const saturatedChrome = computed(() =>
    chroma.hsv(hsv.h, hsv.s + scale(saturateValue.value, 0, 100, 0, hsv.s), hsv.v),
);
const darkenedChrome = computed(() =>
    chroma.hsv(hsv.h, hsv.s, hsv.v - scale(darkenValue.value, 0, 100, 0, hsv.v)),
);
const lightenedChrome = computed(() => {
    return chrome.value.set(
        "hsl.l",
        chrome.value.get("hsl.l") +
            scale(lightenValue.value, 0, 100, 0, 1 - chrome.value.get("hsl.l")),
    );
});
const desaturatedCss = computed(() => desaturatedChrome.value.css());
const saturatedCss = computed(() => saturatedChrome.value.css());
const darkenedCss = computed(() => darkenedChrome.value.css());
const lightenedCss = computed(() => lightenedChrome.value.css());
const desaturatedBackground = computed(() => ({
    background: desaturatedCss.value,
}));
const saturatedBackground = computed(() => ({
    background: saturatedCss.value,
}));
const lightenedBackground = computed(() => ({
    background: lightenedCss.value,
}));
const darkenedBackground = computed(() => ({
    background: darkenedCss.value,
}));
const colorBackground = computed(() => ({
    background: rgb.value,
}));

const desaturatedSliderBackground = computed(() => {
    const desaturated = chrome.value.set("hsl.s", 0);
    return `linear-gradient(to right, ${chrome.value.css()}, ${desaturated.css()})`;
});
const saturatedSliderBackground = computed(() => {
    const saturated = chrome.value.set("hsl.s", 1);
    return `linear-gradient(to right, ${chrome.value.css()}, ${saturated.css()})`;
});
const lightenedSliderBackground = computed(() => {
    const lightened = chrome.value.set("hsl.l", 1);
    return `linear-gradient(to right, ${chrome.value.css()}, ${lightened.css()})`;
});
const darkenedSliderBackground = computed(() => {
    const darkened = chrome.value.set("hsl.l", 0);
    return `linear-gradient(to right, ${chrome.value.css()}, ${darkened.css()})`;
});

const updateColor = (value: { hue: number; sat: number; val: number }) => {
    hsv.h = value.hue;
    hsv.s = value.sat;
    hsv.v = value.val;
};
const updateColorName = () => {
    if (names.value.length === 0) return;
    sortNames();
};
const sortNames = () => {
    names.value.sort(
        (a, b) => chroma.distance(a.hex, hex.value) - chroma.distance(b.hex, hex.value),
    );
};
const fetchNames = async () => {
    const data = await fetch("/api/Name.json");
    names.value = await data.json();
    updateColorName();
};
const lightenClicked = () => {
    console.log("Lighten");
    updateColor({
        hue: lightenedChrome.value.get("hsv.h"),
        sat: lightenedChrome.value.get("hsv.s"),
        val: lightenedChrome.value.get("hsv.v"),
    });
    updateColorName();
};
const darkenClicked = () => {
    updateColor({
        hue: darkenedChrome.value.get("hsv.h"),
        sat: darkenedChrome.value.get("hsv.s"),
        val: darkenedChrome.value.get("hsv.v"),
    });
    updateColorName();
};
const saturateClicked = () => {
    updateColor({
        hue: saturatedChrome.value.get("hsv.h"),
        sat: saturatedChrome.value.get("hsv.s"),
        val: saturatedChrome.value.get("hsv.v"),
    });
    updateColorName();
};
const desaturateClicked = () => {
    updateColor({
        hue: desaturatedChrome.value.get("hsv.h"),
        sat: desaturatedChrome.value.get("hsv.s"),
        val: desaturatedChrome.value.get("hsv.v"),
    });
    updateColorName();
};
</script>
<style scoped>
.content {
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: center;
    padding: 12px;
    grid-gap: 24px;
}

.column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    grid-gap: 8px;

    min-width: 24ch;
}

#color {
    border-radius: 12px;

    width: 25vw;
    height: 25vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

#color > p {
    font-size: 50px;
    font-weight: normal;
}

.column > .copyField {
    width: 100%;
}

.column > .copyField > p {
    flex-grow: 1000;
}

#copyFields {
    display: flex;
    flex-direction: column;
    grid-gap: 8px;
    width: 200px;
}

.sliderpartpart {
    border-radius: 12px;
    width: 100%;
    padding: 8px;
}

.sliderpartParent {
    display: flex;
    flex-direction: column;
    width: 100%;
    grid-gap: 4px;
    border-radius: 12px;
    padding: 6px;
}

@media screen and (max-width: 1100px) {
    .content {
        flex-direction: column;
        align-items: center;
    }

    .column {
        width: 100%;
        align-items: center;
    }

    #color {
        width: 100%;
    }

    #copyFields {
        flex-direction: row;
        flex-wrap: wrap;
    }

    #convertedColumn {
        order: 2;
    }

    #pickerColumn {
        order: 1;
    }

    #colorColumn {
        order: 3;
    }
}
</style>
