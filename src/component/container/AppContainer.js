// LICENSE : MIT
"use strict";
import React from "react";
import PDFViewer from "../project/PDFViewer/PDFViewer";
export default class AppContainer extends React.Component {
    render() {
        return <div className="AppContainer">
            <PDFViewer url="/javascript-promise-book.pdf"/>
        </div>;
    }
}
