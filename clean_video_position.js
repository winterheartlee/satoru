const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');

// Remove all .s-hero__video media query overrides that only set 'bottom' or similar
css = css.replace(/\.s-hero__video\s*\{[^}]+\}/g, (match) => {
    if (match.includes('position: absolute')) {
        return match; // Keep the base definition
    }
    return ''; // Remove the overrides
});

fs.writeFileSync('css/styles.css', css);
console.log('CSS updated successfully');
