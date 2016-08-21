// LICENSE : MIT
"use strict";
export default class PDFViewer {
    /**
     * @param {PDFDocument} document
     */
    constructor({document}) {
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