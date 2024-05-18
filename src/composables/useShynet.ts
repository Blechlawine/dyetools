import { useScript } from "@unhead/vue";

type Shynet = {
    newPageLoad(): void;
};

export function useShynet() {
    return useScript<Shynet>(
        "https://shynet.zmarc.de/ingress/a7db0259-1c07-48ae-87ec-7d70c8a6d030/script.js",
        {
            use() {
                // biome-ignore lint/suspicious/noExplicitAny:
                return (window as any).Shynet;
            },
        },
    );
}
