// LICENSE : MIT
"use strict";
import ReduceStore from "../base/ReduceStore"
import PDFViewerState from "./PDFViewerState";
export default class PDFViewerStore extends ReduceStore {
    /**
     *
     * @param {PDFViewerRepository} pdfViewerRepository
     */
    constructor({pdfViewerRepository}) {
        super();
        this.state = new PDFViewerState({
        });
        pdfViewerRepository.onChange(this._onChange.bind(this));
    }

    getState() {
        return {
            pdfViewer: this.state
        };
    }

    _onChange(pdfViewer){
        this.setState(this.state.update(pdfViewer));
    }
}