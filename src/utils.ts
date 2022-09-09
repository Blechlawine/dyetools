function scale(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

function copyString(value: string) {
    navigator.clipboard.writeText(value);
}

function genRandHex(size: number) {
    return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

export { scale, copyString, genRandHex };
