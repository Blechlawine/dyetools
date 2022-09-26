<template>
    <div class="numberInput">
        <input type="number" v-model="value" :min="min" :max="max" :step="step" />
        <div class="numberInputButtons">
            <div class="numberInputButton minus" @click="value = value - step">
                <Icon name="md-remove" size="xs"></Icon>
            </div>
            <div class="{style.divider}"></div>
            <div class="numberInputButton plus" @click="value = value + step">
                <Icon name="md-add" size="xs"></Icon>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import Icon from "../Icon.vue";

const emit = defineEmits<{
    (e: "update:modelValue", value: number): void;
}>();

const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    },
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 255,
    },
    step: {
        type: Number,
        default: 1,
    },
});

const value = computed({
    get: () => props.modelValue,
    set(newValue: number) {
        emit("update:modelValue", Math.max(Math.min(newValue, props.max), props.min));
    },
});
</script>
<style scoped>
.numberInput {
    border: 1px solid var(--light-gray);
    border-radius: 6px;

    height: 25px;
    width: min-content;

    padding: 2px;
    padding-left: 6px;

    display: flex;
    flex-direction: row;
    grid-gap: 6px;
    align-items: center;
    justify-content: center;

    background: var(--background);
}

.numberInputButtons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    grid-gap: 4px;

    border-radius: 4px;
    border: 1px solid var(--light-gray);

    height: 100%;

    user-select: none;
}

.numberInputButton {
    width: 16px;
    height: 16px;

    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.divider {
    width: 1px;
    height: 100%;
    background-color: var(--light-gray);
}

.numberInput > input {
    border: none;
    outline: none;
    width: 24px;

    font-size: 12px;

    text-align: center;

    appearance: textfield;

    background: transparent;
}

/* Removes arrow buttons in numberinput */
.numberInput > input::-webkit-outer-spin-button,
.numberInput > input::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
}
</style>
