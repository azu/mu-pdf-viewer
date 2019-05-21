// LICENSE : MIT

import {QueuedStoreGroup} from "almin";
// stores
import PDFViewerStore from "./PDFViewer/PDFViewerStore";
// repository
import pdfViewerRepository from "../infra/repository/PDFViewerRepository";
export default function createStoreGroup() {
    return new QueuedStoreGroup([
        new PDFViewerStore({pdfViewerRepository})
    ]);
}
