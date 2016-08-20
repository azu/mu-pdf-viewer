// LICENSE : MIT
"use strict";
import React from "react";
import AppLocator from "../../AppLocator";
import Keyboard from "../uikit/Keyboard";
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
        const keyMap = {
            "a": function() {
                console.log("a");
            }
        };
        return <div className="AppContainer">
            <Keyboard keyMap={keyMap}>
                <PDFViewerContainer pdfViewer={pdfViewer}/>
            </Keyboard>
        </div>;
    }
}
