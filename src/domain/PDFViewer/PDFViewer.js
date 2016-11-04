// LICENSE : MIT
"use strict";
let id = 0;
export default class PDFViewer {
    /**
     * @param {PDFDocument} document
     */
    constructor({document}) {
        this.id = id++;
        this.document = document;
    }

    /**
     * @param {PDFDocument} newDocument
     */
    changeDocument(newDocument) {
        if (this.document === newDocument) {
            return;
        }
        this.document = newDocument;
    }
}