// LICENSE : MIT
"use strict";
const React = require("react");
const qs = require("querystring");
const fs = require("fs");
const shell = require('electron').shell;
const openURL = (URL) => {
    if (/^https?:/.test(URL)) {
        shell.openExternal(URL, {
            activate: true
        });
    }
};
export default class PDFViewer extends React.Component {
    static get propTypes() {
        return {
            url: React.PropTypes.string,
            onLoad: React.PropTypes.func,
            onFind: React.PropTypes.func,
            onFindClose: React.PropTypes.func,
            onDrop: React.PropTypes.func
        }
    }

    /**
     * @return {string}
     */
    static get PDFJS_VIEWER_HTML() {
        return "./pdfjs/web/viewer.html";
    }

    /**
     * @return {PDFViewerApplication|undefined}
     */
    get PDFViewerApplication() {
        if (!this.iframe) {
            return;
        }
        return this.iframe.contentWindow.PDFViewerApplication;
    }

    /**
     * base64 image
     * @return {Promise}
     */
    async currentPageAsHTML() {
        let PDFViewerApplication = this.PDFViewerApplication;
        if (!PDFViewerApplication) {
            return;
        }
        const page = PDFViewerApplication.page;
        const canvas = this.iframe.contentWindow.document.querySelector(`canvas#page${page}`);
        if (!canvas) {
            return;
        }

        const selection = this.iframe.contentWindow.getSelection();
        const canvasRect = canvas.getBoundingClientRect();
        const selectionStartNodeRect = selection.anchorNode.parentNode.getBoundingClientRect()
        const selectionEndNodeRect = selection.focusNode.parentNode.getBoundingClientRect()

        const cropCanvas = (sourceCanvas, { left, top, width, height }) => {
            const destCanvas = document.createElement('canvas');
            destCanvas.width = width;
            destCanvas.height = height;
            destCanvas.getContext("2d").drawImage(
                sourceCanvas,
                left, top, width, height,  // source rect with content to crop
                0, 0, width, height);      // newCanvas, same size as source rect
            return destCanvas;
        }
        const selectionRange = {
            top: (selectionStartNodeRect.top < selectionEndNodeRect.top ? selectionStartNodeRect.top : selectionEndNodeRect.top) - canvasRect.top,
            left: (selectionStartNodeRect.left < selectionEndNodeRect.left ? selectionStartNodeRect.left : selectionEndNodeRect.left) - canvasRect.left,
            right: (selectionStartNodeRect.right > selectionEndNodeRect.right ? selectionStartNodeRect.right : selectionEndNodeRect.right) - canvasRect.left,
            bottom: (selectionStartNodeRect.bottom > selectionEndNodeRect.bottom ? selectionStartNodeRect.bottom : selectionEndNodeRect.bottom) - canvasRect.top
        }
        const MARGIN = 16;
        const croppedCanvas = cropCanvas(canvas, {
            top: selectionRange.top - MARGIN,
            left: 0,
            width: canvas.width,
            height: Math.abs(selectionRange.bottom - selectionRange.top) + MARGIN * 2,
        });
        const pageObject = await PDFViewerApplication.pdfDocument.getPage(page);
        const results = await pageObject.getTextContent();
        const textContent = results.items.map(item => item.str).join("");
        return `<img src="${croppedCanvas.toDataURL('image/png')}" alt="${textContent}" />`;
    }

    set page(pageNumber) {
        if (!this.iframe) {
            return;
        }

        const PDFViewerApplication = this.iframe.contentWindow.PDFViewerApplication;
        PDFViewerApplication.page = pageNumber;
        PDFViewerApplication.pdfHistory.push({
            hash: `#page=${pageNumber}`,
            page: pageNumber
        });
    }

    constructor() {
        super();
        this.iframe = null;

        this._onDragOver = (event) => {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        };
        this._onDrop = (event) => {
            if (typeof this.props.onDrop === "function") {
                this.props.onDrop(event);
            }
        };
        this._onDocumentLoad = () => {
            if (typeof this.props.onLoad === "function") {
                this.props.onLoad(this.PDFViewerApplication.url);
            }
            this.iframe.focus();
        };
        this._onIframeLoad = () => {
            this._addEventToIframe();
        };
        this._onDocumentClick = (event) => {
            event.preventDefault();
            openURL(event.target.href);
        };

        this._onFind = (event) => {
            this.props.onFind(event);
        };
        this._onFindClose = (event) => {
            this.props.onFindClose(event);
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.PDFViewerApplication) {
            return this.PDFViewerApplication.url !== nextProps.url;
        }
        return nextProps.url !== this.props.url;
    }

    componentWillUnmount() {
        const iframe = this.iframe;
        const iframeWindow = iframe.contentWindow;
        iframeWindow.removeEventListener("documentload", this._onDocumentLoad);
    }

    componentDidUpdate(prevProps) {
        this._addEventToIframe();
    }

    render() {
        const param = qs.stringify({ file: this.props.url });
        return <iframe className="PDFViewer"
                       src={`${PDFViewer.PDFJS_VIEWER_HTML}?${param}`}
                       ref={(c) => this.iframe = c}
                       onLoad={this._onIframeLoad}
                       allowFullScreen
        />;
    }

    _addEventToIframe() {
        const iframe = this.iframe;
        if (!iframe) {
            return;
        }
        const iframeWindow = iframe.contentWindow;
        // remove events
        iframeWindow.removeEventListener("documentload", this._onDocumentLoad);
        iframeWindow.document.removeEventListener("drop", this._onDrop);
        iframeWindow.document.removeEventListener("dragover", this._onDragOver);
        iframeWindow.document.removeEventListener('click', this._onDocumentClick);
        iframeWindow.removeEventListener('find', this._onFind);
        iframeWindow.removeEventListener('findagain', this._onFind);
        iframeWindow.removeEventListener('findclose', this._onFindClose);
        // onload document
        iframeWindow.addEventListener("documentload", this._onDocumentLoad);
        iframeWindow.document.addEventListener("drop", this._onDrop);
        iframeWindow.document.addEventListener("dragover", this._onDragOver);
        iframeWindow.document.addEventListener('click', this._onDocumentClick);
        iframeWindow.addEventListener('find', this._onFind);
        iframeWindow.addEventListener('findagain', this._onFind);
        iframeWindow.addEventListener('findclose', this._onFindClose);

    }

    _injectPluginToWebView() {
        const webview = this.iframe;
        if (!webview) {
            return;
        }
        const jsContents = [
            fs.readFileSync(__dirname + "/plugins/keyboard.js", "utf-8")
        ];
        jsContents.forEach((content) => {
            webview.executeJavaScript(content);
        })
    }
}
