// LICENSE : MIT
"use strict";
const React = require("react");
import PDFFindListItem from "./PDFFindListItem";
export default class PDFFindList extends React.Component {
    static get propTypes() {
        return {
            items: React.PropTypes.array,
            onItemClick: React.PropTypes.func,
        }
    }

    constructor() {
        super();
    }

    render() {
        if (!this.props.active) {
            return null;
        }
        const items = this.props.items.map((item) => {
            const onItemClick = (event) => {
                this.props.onItemClick(event, item);
            };
            return <PDFFindListItem
                className="PDFFindList-item"
                key={item.text}
                pageNumber={item.pageNumber}
                onClick={onItemClick}
            >{item.text}</PDFFindListItem>;
        });
        return <div className="PDFFindList">
            <ul className="PDFFindList-main">
                {items}
            </ul>
        </div>;
    }
}
