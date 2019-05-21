import {Context, Dispatcher} from "almin";
import AlminLogger from "almin-logger";
import React from "react";
import ReactDOM from "react-dom";
import AppLocator from "./AppLocator";
// component
import AppContainer from "./component/container/AppContainer";
// store
import createStoreGroup from "./store/AppStoreGroup";
// use-case
import InitializeDomainUseCase from "./use-case/InitializeDomainUseCase";

const qs = require('querystring');

function requireAll(r) {
    r.keys().forEach(r);
}

require("normalize.css/normalize.css");
requireAll(require.context('./css/', true, /\.css$/));
requireAll(require.context('./component/', true, /\.css$/));
const storeGroup = createStoreGroup();
const context = new Context({
    dispatcher: new Dispatcher(),
    store: storeGroup
});
const alminLogger = new AlminLogger();
alminLogger.startLogging(context);
AppLocator.context = context;
// Initialize and start rendering
const query = qs.parse(window.location.search.slice(1));
AppLocator.context.useCase(InitializeDomainUseCase.create()).execute(query).then(() => {
    ReactDOM.render(<AppContainer/>, document.getElementById("root"));
});

