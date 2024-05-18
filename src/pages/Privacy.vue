<template>
    <Head>
        <meta name="description" content="Our privacy policy" />
        <meta property="og:description" content="Our privacy policy" />
        <meta property="og:title" content="Dyetools - Privacy Policy" />
        <title>Dyetools - {{ $t("privacy.title") }}</title>
    </Head>
    <div class="prose mx-auto">
        <PrivacyMarkdown />
    </div>
</template>
<script setup lang="ts">
import PrivacyMarkdown from "../assets/privacy.md";
import { Head } from "@unhead/vue/components";
</script>
