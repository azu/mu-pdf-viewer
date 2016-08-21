// LICENSE : MIT
"use strict";
window.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
        case 74: // 'j'
        case 78: // 'n'
            event.stopPropagation();
            console.log("j");
    }
});