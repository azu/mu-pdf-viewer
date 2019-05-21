// LICENSE : MIT

import ReduceState from "../base/ReduceState";
export default class PDFViewerState extends ReduceState {
    /**
     * @param {PDFViewerState|Object} [state]
     */
    constructor(state = {}) {
        super();
        this.url = state.url;
    }

    /**
     * @param {PDFViewer} pdfViewer
     * @returns {PDFViewerState}
     */
    update(pdfViewer) {
        if (!pdfViewer.document.url) {
            return this;
        }
        return new PDFViewerState(Object.assign({}, this, {
            url: pdfViewer.document.url
        }));
    }

    reduce(payload) {
        switch (payload.type) {
            default:
                return this;
        }
    }
}
