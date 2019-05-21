// LICENSE : MIT
"use strict";
const React = require("react");
const ReactDOM = require("react-dom");
const MouseTrap = require("mousetrap");
require("mousetrap/plugins/pause/mousetrap-pause");
require("mousetrap/plugins/bind-dictionary/mousetrap-bind-dictionary");
/**
 * React Component wrapped for Mousetrap
 * https://craig.is/killing/mice#api.reset
 * @example
 *
 * Register keyMap to Component
 * <Keyboard keyMap={keyMap}>
 *  <Component />
 * </Keyboard>
 *
 * Register keyMap to Window
 * <Keyboard keyMap={keyMap} />
 */
export default class Keyboard extends React.Component {
    static get propTypes() {
        return {
            disabled: React.PropTypes.bool,
            /**
             * Bind dictionary
             * https://craig.is/killing/mice
             * {
             *     'a': function() { console.log('a'); },
             *     'b': function() { console.log('b'); }
             * }
             */
            keyMap: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
        }
    }

    constructor() {
        super();
    }

    get hasChildren() {
        return React.Children.count(this.props.children) > 0;
    }

    componentWillReceiveProps(nextProps) {
        this._updateDisabledStatus(nextProps.disabled);
    }

    componentDidMount() {
        this._registerBindKeyMap(this.props.keyMap);
    }

    componentWillUnmount() {
        Mousetrap.reset();
    }

    render() {
        if (!this.hasChildren) {
            return null;
        }
        const child = React.Children.only(this.props.children);
        return React.cloneElement(child, {
            ref: "Keyboard"
        });
    }

    _updateDisabledStatus(disabled) {
        if (disabled === undefined) {
            return;
        }
        if (disabled) {
            MouseTrap.pause();
        } else {
            MouseTrap.unpause();
        }
    }

    /**
     * register bindKeyMap
     * @private
     */
    _registerBindKeyMap() {
        const bindKeyMap = this.props.keyMap;
        if (bindKeyMap === undefined) {
            return;
        }
        if (this.hasChildren) {
            // bind to the children node
            const domNode = ReactDOM.findDOMNode(this.refs.Keyboard);
            MouseTrap(domNode).bind(bindKeyMap);
        } else {
            // bind to global
            MouseTrap.bind(bindKeyMap);
        }
    }
}
