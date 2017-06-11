import iconfont from "./fonts/flaticon";
import styles from "./styles/common";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import AppContainer from "./containers/AppContainer";
import store from "./state/store";

window.onload = function() {
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer />
    </Provider>,
    document.getElementById("app")
  );
};
