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

    /**
     * Create and initialize domain with location query object
     * @param {Object} query
     */
    execute(query) {
        // html?file=default-pdf-file
        // or
        // html?_=default-pdf-file
        const url = query.file || query._;
        // Create {@link PDFViewer}
        const pdfViewer = PDFViewerFactory.create({url});
        this.pdfViewerRepository.save(pdfViewer);
    }
}