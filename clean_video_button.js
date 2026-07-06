const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');

// Strip out .s-hero__video-link and .s-hero__video svg and .s-hero__video-text from media queries
// We only want to keep the base definition which is .s-hero__video-link.glass-pill
css = css.replace(/\.s-hero__video-link\s*\{[^}]+\}/g, '');
css = css.replace(/\.s-hero__video svg\s*\{[^}]+\}/g, '');
css = css.replace(/\.s-hero__video-text\s*\{[^}]+\}/g, '');

fs.writeFileSync('css/styles.css', css);
console.log('CSS updated successfully');
