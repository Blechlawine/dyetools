<template>
    <div id="tabsWrapper">
        <div id="tabHighlight" :style="tabHighlightStyles"></div>
        <div id="tabs">
            <router-link
                v-for="(route, index) in routes"
                :key="index"
                :to="route.path"
                class="tab"
                :id="Router.currentRoute.value.path === route.path ? 'activeTab' : ''"
            >
                {{ route.name }}
            </router-link>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import routes from "../../routes";

const Router = useRouter();

const highlightWidth = ref(0);
const prevHighlightWidth = ref(0);
const highlightMarginLeft = ref(0);
const prevHighlightMarginLeft = ref(0);

watch(
    () => Router.currentRoute.value,
    () => updateHighlight()
);

onMounted(() => {
    updateHighlight();
});

const updateHighlight = () => {
    highlightWidth.value = document.getElementById("activeTab")!.clientWidth;
    highlightMarginLeft.value =
        document.getElementById("activeTab")!.getBoundingClientRect().left -
        document.getElementById("tabs")!.getBoundingClientRect().left;
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

#activeTab {
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
