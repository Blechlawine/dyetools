<template>
    <Head>
        <meta property="og:title" content="Dyetools - Impressum" />
        <title>Dyetools - {{ $t("impressum.title") }}</title>
    </Head>
    <div class="prose mx-auto">
        <ImpressumMarkdown />
    </div>
</template>
<script setup lang="ts">
import ImpressumMarkdown from "../assets/impressum.md";
import { Head } from "@unhead/vue/components";
</script>
