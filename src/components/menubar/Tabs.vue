<template>
    <div id="tabsWrapper">
        <div id="tabHighlight" :style="tabHighlightStyles"></div>
        <div id="tabs" ref="tabsRef">
            <span
                v-for="(route, index) in routes"
                :key="index"
                ref="linksRef"
                class="tab"
                :data-link="route.path"
            >
                <router-link :to="route.path" active-class="activeTab">
                    {{ $t(route.name?.toString() ?? "") }}
                </router-link>
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import routes from "../../routes";
import { prevHighlightMarginLeft, prevHighlightWidth } from "../../stores/store";

const Router = useRouter();

const highlightWidth = ref(0);
const highlightMarginLeft = ref(0);
const linksRef = ref<HTMLSpanElement[]>([]);
const tabsRef = ref<HTMLElement | undefined>(undefined);

Router.afterEach((to, from) => {
    nextTick(updateHighlight);
});

onMounted(() => {
    updateHighlight();
});

const updateHighlight = () => {
    highlightWidth.value = linksRef.value.find(
        (lr) => lr.dataset.link === Router.currentRoute.value.path
    )!.clientWidth;
    highlightMarginLeft.value =
        linksRef.value
            .find((lr) => lr.dataset.link === Router.currentRoute.value.path)!
            .getBoundingClientRect().left - tabsRef.value!.getBoundingClientRect().left;
    prevHighlightMarginLeft.value = highlightMarginLeft.value;
    prevHighlightWidth.value = highlightWidth.value;
};

const tabHighlightStyles = computed(() => ({
    width: highlightWidth.value + "px",
    "margin-left": highlightMarginLeft.value + "px",
}));
</script>
<style scoped>
#tabs {
    background-color: var(--light-gray);
    padding: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    position: relative;
}

.tab {
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: color 200ms ease;
    z-index: 2;
}

.activeTab {
    color: var(--text-white);
}

#tabHighlight {
    margin-top: 6px;
    margin-left: 6px;
    border-radius: 6px;
    position: absolute;
    background-color: var(--accent);
    z-index: 1;
    padding: 16px 12px;
    transition: all 200ms ease;
}
</style>
