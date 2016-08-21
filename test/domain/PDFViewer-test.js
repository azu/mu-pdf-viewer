// LICENSE : MIT
"use strict";
const assert = require("assert");
import PDFViewerFactory from "../../src/domain/PDFViewer/PDFViewerFactory";
import PDFViewer from "../../src/domain/PDFViewer/PDFViewer";
describe("PDFViewer", () => {
    it("is created by PDFViewerFactory", () => {
        const pdfViewer = PDFViewerFactory.create();
        assert(pdfViewer instanceof PDFViewer);
    });
});