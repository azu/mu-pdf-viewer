// LICENSE : MIT
"use strict";
const React = require("react");
import PDFViewer from "../../project/PDFViewer/PDFViewer";
// state
import PDFViewerState from "../../../store/PDFViewer/PDFViewerState";
export default class PDFViewerContainer extends React.Component {
    static get propTypes() {
        return {
            pdfViewer: React.PropTypes.instanceOf(PDFViewerState).isRequired
        };
    }

    render() {
        return <div className="PDFViewerContainer">
            <PDFViewer url={this.props.pdfViewer.url}/>
        </div>
    }
}