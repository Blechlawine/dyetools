<template>
    <div class="copyField">
        <div class="miniToast" v-show="showToast">copied!</div>
        <p>{{ value }}</p>
        <div class="copyBtn" @click="copyToClipboard">
            <Icon size="sm" name="md-contentcopy"></Icon>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import Icon from "../Icon.vue";
import { copyString } from "../../utils";

const props = defineProps({
    value: {
        type: String,
        required: true,
    },
});

const showToast = ref(false);

const copyToClipboard = () => {
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 1200);
    copyString(props.value);
};
</script>
<style scoped>
.copyField {
    padding: 9px 8px;
    padding-left: 10px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    grid-gap: 10px;

    border: 2px solid var(--light-gray);
    border-radius: 6px;
    width: max-content;

    font-size: 14px;

    background-color: var(--background);
    position: relative;
}

.copyBtn {
    cursor: pointer;
    height: 18px;
}

.copyField p {
    text-align: right;
}

.miniToast {
    padding: 8px 20px;
    z-index: 1000;
    background: var(--background);
    box-shadow: var(--shadow4px);
    border-radius: 6px;
    position: absolute;
    margin-left: 100%;
    transition: opacity 200ms;
    pointer-events: none;
}
</style>
