const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');

// Update base h1
css = css.replace(
    /\.s-hero__content h1\s*{\s*font-size:\s*22rem;/g,
    '.s-hero__content h1 {\n    font-size: clamp(4rem, 15vw, 22rem);'
);

// Update base subtitle
css = css.replace(
    /\.s-hero__content-about\s*{\s*font-family:[^}]+font-size:\s*2\.8rem;[^}]+}/g,
    `.s-hero__content-about {
    font-family: var(--font-2);
    font-weight: 300;
    font-size: clamp(1.2rem, 3vw, 2.8rem);
    letter-spacing: 0.4em;
    line-height: 1.444;
    color: var(--color-white);
    padding-left: 3.6em;
    position: relative;
}`
);

// Remove specific h1 and subtitle media query overrides
css = css.replace(/\.s-hero__content h1\s*\{[^}]+\}/g, (match, offset, string) => {
    // If it's the base one (with clamp), don't remove it
    if (match.includes('clamp')) return match;
    return '';
});

css = css.replace(/\.s-hero__content-about\s*\{[^}]+\}/g, (match, offset, string) => {
    if (match.includes('clamp')) return match;
    // preserve the padding-left overrides if needed? Actually clamp covers font-size, we can just remove font-size overrides.
    return match; // Let's refine this to only remove font-size from about.
});

// Remove h1::before blocks entirely
css = css.replace(/\.s-hero__content h1::before\s*\{[^}]+\}/g, '');

// Also remove the commented out block for ::before
css = css.replace(/\/\*[\s\S]*?\.s-hero__content h1::before[\s\S]*?\*\//g, '');

fs.writeFileSync('css/styles.css', css);
console.log('CSS updated successfully');
