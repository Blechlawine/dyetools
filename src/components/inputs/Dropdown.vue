<template>
    <div class="dropdown">
        <div class="hackyCloseButton" v-if="open" @click="() => (open = false)"></div>
        <div @click="open = !open" class="dropdownValue" :style="[widthStyle, valueStyle]">
            <p>{{ value }}</p>
            <Icon :name="open ? 'i-tabler-chevron-up' : 'i-tabler-chevron-down'"></Icon>
        </div>
        <div class="dropdownValues" :style="widthStyle" v-if="open">
            <span v-for="v in values" @click="onValueClick(v)">{{ v }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import Icon from "../Icon.vue";
import { computed, onMounted, PropType, ref } from "vue";

const props = defineProps({
    values: {
        type: Array as PropType<string[]>,
        required: true,
    },
});
const emit = defineEmits<{
    (e: "select", valueIndex: number): void;
}>();

const valueIndex = ref(0);
const width = ref(0);
const open = ref(false);

const value = computed(() => props.values[valueIndex.value]);
const valueStyle = computed(() => ({
    border: `2px solid ${open.value ? "var(--accent)" : "var(--light-gray)"}`,
}));
const widthStyle = computed(() => ({
    width: `calc(${width.value}ch + 24px + 10px + 24px)`,
}));

onMounted(() => {
    let length = 0;
    props.values.forEach((v) => {
        if (v.length > length) length = v.length;
    });
    width.value = length;
});

const onValueClick = (value: string) => {
    valueIndex.value = props.values.indexOf(value);
    open.value = false;
    emit("select", valueIndex.value);
};
</script>
<style scoped>
.dropdown {
    width: max-content;
    cursor: pointer;
}

.dropdownValue {
    z-index: 2;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    grid-gap: 10px;

    border-radius: 6px;
    padding: 6px 8px;
    padding-left: 12px;
}

.dropdownValue span {
    cursor: pointer;
}

.dropdownValues {
    position: absolute;
    /* margin-top: 40px; */

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    padding: 6px 0;

    z-index: 3;

    border-radius: 6px;

    background-color: var(--background);
    box-shadow: var(--shadow4px);
}

.dropdownValues span {
    padding: 6px 10px;
    width: 100%;
    cursor: pointer;
    user-select: none;
}

.dropdownValues .active {
    background-color: var(--light-gray);
}

.hackyCloseButton {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    cursor: auto;
}
</style>
