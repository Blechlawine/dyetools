<template>
    <header>
        <div class="top">
            <span class="title">
                <img class="logo" src="/favicon.png" alt="Dyetools logo" />
                <p>Dyetools</p>
            </span>

            <div class="rightStuff">
                <ToggleSwitch></ToggleSwitch>
            </div>
        </div>
        <div class="bottom">
            <Tabs />
        </div>
    </header>
</template>

<script setup lang="ts">
import Tabs from "./Tabs.vue";
import ToggleSwitch from "../ToggleSwitch.vue";
</script>

<style>
header {
    width: 100%;
    height: 128px;
    border-bottom: 2px solid var(--light-gray);
    top: 0;
    position: sticky;

    z-index: 20;
    background-color: var(--background);
}

header > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 8px 8px 8px 16px;
}

header .top {
    height: 64px;
}

header .bottom {
    justify-content: center;
}

.rightStuff {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    grid-gap: 12px;
}

.title {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.title p {
    font-size: 1.5rem;
    font-weight: bold;
}

.logo {
    height: 36px;
    aspect-ratio: 1/1;
}

@media all and (min-width: 600px) {
    header div.bottom {
        margin-top: -64px;
    }

    header {
        height: 64px;
    }
}
</style>