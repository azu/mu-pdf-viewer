// LICENSE : MIT
"use strict";
import {UseCase} from 'almin';
// repository
import pdfViewerRepository from "../infra/repository/PDFViewerRepository"
// domain
import PDFViewerFactory from "../domain/PDFViewer/PDFViewerFactory";
/**
 * Create and Initialize Domain model.
 */
export default class InitializeDomainUseCase extends UseCase {
    static create() {
        return new this({pdfViewerRepository});
    }

    constructor({pdfViewerRepository}) {
        super();
        this.pdfViewerRepository = pdfViewerRepository;
    }

    execute() {
        // Create {@link PDFViewer}
        const pdfViewer = PDFViewerFactory.create();
        this.pdfViewerRepository.save(pdfViewer);
    }
}