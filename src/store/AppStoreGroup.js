// LICENSE : MIT
"use strict";
import {QueuedStoreGroup} from "almin";
// stores
import PDFViewerStore from "./PDFViewer/PDFViewerStore";
export default function createStoreGroup(){
    return new QueuedStoreGroup([
        new PDFViewerStore()
    ]);
}