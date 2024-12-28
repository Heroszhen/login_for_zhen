window.__unocss = {
    rules: [
        [/^hero-bg-color-(\w+)$/, ([, color]) => ({ 'background-color': color })],
        [/^hero-color-(\w+)$/, ([, color]) => ({ 'color': color })],
        [/^hero-width-(\d+)$/, ([, width]) => ({ 'width': `${width}px` })],
    ]
}