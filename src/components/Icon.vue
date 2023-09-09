<template>
    <div :class="['icon', sizeClass, name]"></div>
</template>
<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
    name: {
        type: String as PropType<`i-tabler-${string}`>,
        required: true,
    },
    size: {
        type: String as PropType<"sm" | "xs" | "xl" | undefined>,
        required: false,
    },
});

const sizeClass = computed(() => `icon-${props.size}`);
</script>
<style scoped>

.icon:not(.icon-sm):not(.icon-xs):not(.icon-xl) {
    width: 24px;
    height: 24px;
}

.icon-sm {
    width: 18px;
    height: 18px;
}

.icon-xs {
    width: 16px;
    height: 16px;
}

.icon-xl {
    width: 48px;
    height: 48px;
}
</style>
