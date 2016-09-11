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
    }


    componentWillReceiveProps(nextProps) {

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

    componentWillUpdate() {
        this._addEventToIframe();
    }

    render() {
        const param = qs.stringify({file: this.props.url});
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
        // onload document
        iframeWindow.addEventListener("documentload", this._onDocumentLoad);
        iframeWindow.document.addEventListener("drop", this._onDrop);
        iframeWindow.document.addEventListener("dragover", this._onDragOver);
        iframeWindow.document.addEventListener('click', this._onDocumentClick);

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
