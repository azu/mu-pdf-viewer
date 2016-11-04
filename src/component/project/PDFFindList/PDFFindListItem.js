// LICENSE : MIT
"use strict";
const React = require("react");
export default class PDFFindListItem extends React.Component {
    render() {
        return <li
            className={this.props.className}
            onClick={this.props.onClick}>
            <span className="PDFFindListItem-pageNumber">{this.props.pageNumber}</span>
            {this.props.children}
        </li>
    }
}