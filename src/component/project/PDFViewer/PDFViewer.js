// LICENSE : MIT
"use strict";
const React = require("react");
const qs = require("querystring");
export default class PDFViewer extends React.Component {
    static get propTypes() {
        return {
            url: React.PropTypes.string.isRequired
        }
    }

    /**
     * @return {string}
     */
    static get PDFJS_VIEWER_HTML() {
        return "./pdfjs/web/viewer.html";
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.url !== this.props.url;
    }

    render() {
        const param = qs.stringify({file: this.props.url});
        return <iframe className="PDFViewer"
                        src={`${PDFViewer.PDFJS_VIEWER_HTML}?${param}`} />;
    }
}
