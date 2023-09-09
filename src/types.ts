export type Color = {
    hashId: string;
    // id: number;
    hex: string;
    locked: boolean;
};

export type Quote = {
    quote: string;
    groot: string;
};

export type SliderMode =
    | "RGB"
    | "HSL"
    | "CMYK"
    | "LAB"
    | "Copic"
    | "RAL"
    | "HKS"
    | "Name"
    | "HEX"
    | "Pantone";
