// LICENSE : MIT
"use strict";
import PDFViewer from "./PDFViewer";
import PDFDocument from "./PDFDocument/PDFDocument";
export default class PDFViewerFactory {
    static create({url}) {
        return new PDFViewer({
            document: new PDFDocument({
                url: url
            })
        });
    }
}