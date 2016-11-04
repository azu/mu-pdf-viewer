// LICENSE : MIT
"use strict";
let id = 0;
export default class PDFDocument {
    constructor({url}) {
        this.id = id++;
        this.url = url;
    }
}