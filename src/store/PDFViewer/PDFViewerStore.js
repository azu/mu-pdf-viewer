// LICENSE : MIT
"use strict";
import ReduceStore from "../base/ReduceStore"
import PDFViewerState from "./PDFViewerState";
export default class PDFViewerStore extends ReduceStore {
    constructor() {
        super();
        this.state = new PDFViewerState({
            url: "file://localhost/Users/azu/Downloads/Abstract.Locale.Operations.pdf"
        });
    }

    getState() {
        return {
            pdfViewer: this.state
        };
    }
}