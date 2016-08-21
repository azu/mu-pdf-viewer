// LICENSE : MIT
"use strict";
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
const storeGroup = createStoreGroup();
const context = new Context({
    dispatcher: new Dispatcher(),
    store: storeGroup
});
const alminLogger = new AlminLogger();
alminLogger.startLogging(context);
AppLocator.context = context;
// Initialize and start rendering
AppLocator.context.useCase(InitializeDomainUseCase.create()).execute().then(() => {
    ReactDOM.render(<AppContainer />, document.getElementById("js-main"));
});

