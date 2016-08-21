// LICENSE : MIT
"use strict";
import {UseCase} from 'almin';
// repository
import pdfViewerRepository from "../../infra/repository/PDFViewerRepository"
// domain
import PDFDocument from "../../domain/PDFViewer/PDFDocument/PDFDocument";
/**
 * Change PDFDocument for PDFViewer
 */
export default class ChangePDFDocumentUseCase extends UseCase {
    static create() {
        return new this({pdfViewerRepository});
    }

    constructor({pdfViewerRepository}) {
        super();
        this.pdfViewerRepository = pdfViewerRepository;
    }

    execute({url}) {
        /**
         * @type {PDFViewer}
         */
        const pdfViewer = this.pdfViewerRepository.lastUsed();
        const document = new PDFDocument({url});
        pdfViewer.changeDocument(document);
        this.pdfViewerRepository.save(pdfViewer);
    }
}