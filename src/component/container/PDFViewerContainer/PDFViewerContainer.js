// LICENSE : MIT
"use strict";
const React = require("react");
import AppLocator from "../../../AppLocator";
import ChangePDFDocumentUseCase from "../../../use-case/PDFViewer/ChangePDFDocumentUseCase";
import PDFViewer from "../../project/PDFViewer/PDFViewer";
import PDFFindList from "../../project/PDFFindList/PDFFindList";
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
        this._isUpdateingFindResults = false;
        this._isUpdateingTimer = null;
        this.pdfViewer = null;
        this.state = {
            matchPages: [],
            findBarActive: false
        };
        this._boundOnDrop = this._onDrop.bind(this);
        this._boundOnLoad = this._onLoad.bind(this);
        this._boundOnFind = this._onFind.bind(this);
        this._boundOnFindClose = this._onFindClose.bind(this);
        this.boundOnItemClick = this._onItemClick.bind(this);
    }

    render() {
        const pdfViewer = this.props.pdfViewer;
        return <div className="PDFViewerContainer">
            <PDFFindList
                items={this.state.matchPages}
                active={this.state.findBarActive}
                onItemClick={this.boundOnItemClick}
            />
            <PDFViewer
                ref={(c) => this.pdfViewer = c }
                url={pdfViewer.url}
                onLoad={this._boundOnLoad}
                onDrop={this._boundOnDrop}
                onFind={this._boundOnFind}
                onFindClose={this._boundOnFindClose}
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

    _onFind(event) {
        const window = event.target;
        const PDFViewerApplication = window.PDFViewerApplication;
        requestAnimationFrame(() => {
            this._updateFindResults(PDFViewerApplication);
        });
    }

    _onFindClose(event) {
        clearTimeout(this._isUpdateingTimer);
        this.setState({
            matchPages: [],
            findBarActive: false
        });
        this._isUpdateingFindResults = false;
    }

    _updateFindResults(PDFViewerApplication) {
        if (this._isUpdateingFindResults) {
            this._isUpdateingTimer = setTimeout(() => {
                this._updateFindResults(PDFViewerApplication);
            }, 100);
            return;
        }
        this._isUpdateingFindResults = true;
        const matchPages = PDFViewerApplication.findController.pageMatches.map((page, index) => {
            if (page.length === 0) {
                return null;
            }
            return {
                pageNumber: index + 1,
                text: PDFViewerApplication.findController.pageContents[index]
            }
        }).filter(page => page != null);

        this.setState({
            matchPages,
            findBarActive: true
        });
        this._isUpdateingFindResults = false;

        if (Object.keys(PDFViewerApplication.findController.pendingFindMatches).length) {
            this._isUpdateingTimer = setTimeout(() => {
                if (this.state.findBarActive) {
                    this._updateFindResults(PDFViewerApplication);
                }
            }, 500);
        }
    }

    _onItemClick(event, item) {
        if (!this.pdfViewer) {
            return;
        }
        this.pdfViewer.page = item.pageNumber;
    }
}