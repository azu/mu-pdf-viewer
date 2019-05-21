import MemoryRepository from "./MemoryRepository/MemoryRepository";
import PDFViewer from "../../domain/PDFViewer/PDFViewer";
const REPOSITORY_CHANGE = 'REPOSITORY_CHANGE';
/**
 * @type {MemoryRepository.<PDFViewer>}
 */
export class PDFViewerRepository extends MemoryRepository {
    constructor() {
        super(PDFViewer);
    }
}
/**
 * @type {MemoryRepository.<PDFViewer>}
 */
const pdfViewer = new PDFViewerRepository();
export default pdfViewer;
