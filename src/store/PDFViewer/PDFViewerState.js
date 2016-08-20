// LICENSE : MIT
"use strict";
import ReduceState from "../base/ReduceState";
export default class PDFViewerState extends ReduceState {
    /**
     * @param {PDFViewerState|Object} [state]
     */
    constructor(state = {}) {
        super();
        this.url = state.url;
    }

    update(domain) {
        return this;
    }

    reduce(payload) {
        switch (payload.type) {
            default:
                return this;
        }
    }
}