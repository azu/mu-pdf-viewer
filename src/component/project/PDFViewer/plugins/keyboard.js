// LICENSE : MIT
"use strict";
module.exports = `
window.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
        case 74: // 'j'
        case 78: // 'n'
            event.stopPropagation();
            console.log("j");
    }
});
`
