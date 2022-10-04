<template>
    <Button class="imgButton" :style="size" @click="$emit('click', $event)">
        <Icon :name="icon"></Icon>
    </Button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.vue";
import Icon from "../Icon.vue";

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    large: {
        type: Boolean,
    },
});

const size = computed(() => ({
    width: props.large ? "48px" : "40px",
    height: props.large ? "48px" : "40px",
}));
</script>

<style scoped>
.imgButton {
    cursor: pointer;
    background-color: var(--light-gray);
    border-radius: 6px;
    padding: 6px;
}
</style>