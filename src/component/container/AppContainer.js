// LICENSE : MIT
"use strict";
import React from "react";
import AppLocator from "../../AppLocator";
import PDFViewerContainer from "./PDFViewerContainer/PDFViewerContainer";

export default class AppContainer extends React.Component {

    constructor() {
        super();
        this.state = AppLocator.context.getState();
        /**
         * @type {Function}
         */
        this.unListen = () => {
            // noop - overwrite
        };
    }

    componentWillMount() {
        const context = AppLocator.context;
        this.unListen = context.onChange(() => {
            this.setState(context.getState());
        });
    }

    componentWillUnmount() {
        if (this.unListen) {
            this.unListen();
        }
    }

    render() {
        /**
         * @type {PDFViewerState}
         */
        const pdfViewer = this.state.pdfViewer;
        return <div className="AppContainer">
            <PDFViewerContainer pdfViewer={pdfViewer}/>
        </div>;
    }
}
