// LICENSE : MIT

const React = require("react");
const qs = require("querystring");
const shell = window.require('electron').shell;
const remote = window.require('electron').remote;
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
        // PDF.jsはfile://じゃないとうまく表示できない問題があるため、file://をもらう
        return remote.getGlobal('pdfjsViewerFilePath')
    }

    /**
     * @return {PDFViewerApplication?}
     */
    get PDFViewerApplication() {
        if (!this.iframe) {
            return;
        }
        return this.iframe.contentWindow.PDFViewerApplication;
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

    componentWillUpdate() {
        this._addEventToIframe();
    }

    render() {
        const param = qs.stringify({file: this.props.url});
        // PDF.jsはfile://じゃないとうまく表示できない問題がある
        // iframeなのはcontentを取るため
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
            require("./plugins/keyboard")
        ];
        jsContents.forEach((content) => {
            webview.executeJavaScript(content);
        })
    }
}
