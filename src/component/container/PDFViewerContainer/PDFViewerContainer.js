// LICENSE : MIT
"use strict";
const React = require("react");
import AppLocator from "../../../AppLocator";
import ChangePDFDocumentUseCase from "../../../use-case/PDFViewer/ChangePDFDocumentUseCase";
import PDFViewer from "../../project/PDFViewer/PDFViewer";
// state
import PDFViewerState from "../../../store/PDFViewer/PDFViewerState";
export default class PDFViewerContainer extends React.Component {
    static get propTypes() {
        return {
            pdfViewer: React.PropTypes.instanceOf(PDFViewerState).isRequired
        };
    }

    constructor() {
        super();
        this._boundOnDrop = this._onDrop.bind(this);
        this._boundOnLoad = this._onLoad.bind(this);
    }

    render() {
        const pdfViewer = this.props.pdfViewer;
        return <div className="PDFViewerContainer">
            <PDFViewer
                url={pdfViewer.url}
                onLoad={this._boundOnLoad}
                onDrop={this._boundOnDrop}
            />
        </div>
    }

    _onLoad(url) {
        AppLocator.context.useCase(ChangePDFDocumentUseCase.create()).execute({url});
    }

    _onDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        const [file] = files;
        if (!file) {
            return;
        }
        AppLocator.context.useCase(ChangePDFDocumentUseCase.create()).execute({
            url: file.path
        });
    }
}