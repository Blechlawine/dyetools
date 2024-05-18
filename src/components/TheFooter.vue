<template>
    <footer>
        <a href="https://github.com/blechlawine/dyetools">Github</a>
        <router-link to="/privacy">{{ $t("privacy.title") }}</router-link>
        <router-link to="/impressum">{{ $t("impressum.title") }}</router-link>
    </footer>
</template>
<script setup lang="ts"></script>
<style scoped>
footer {
    border-top: 2px solid var(--light-gray);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
}

footer a {
    text-decoration: none;
    color: var(--textColor);
    font-size: 14px;
    padding: 6px 8px;
    border-radius: 4px;
}

footer a:hover {
    text-decoration: underline;
}
</style>
