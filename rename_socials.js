const fs = require('fs');
let css = fs.readFileSync('css/styles.css', 'utf8');

// Rename the class
css = css.replace(/\.s-hero__content-social/g, '.s-footer__social');

fs.writeFileSync('css/styles.css', css);
console.log('CSS updated successfully');
