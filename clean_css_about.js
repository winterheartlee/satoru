const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');

// Remove font-size from .s-hero__content-about in media queries
css = css.replace(/(\.s-hero__content-about\s*\{[^}]*?)font-size:\s*[\d\.]+rem;([^}]*\})/g, '$1$2');

fs.writeFileSync('css/styles.css', css);
console.log('CSS updated successfully');
