import { createStore, compose } from "redux";
import rootReducer from "./reducers";

export default createStore(
  rootReducer,
  compose(
    process.env.NODE_ENV === "development" && window.devToolsExtension
      ? window.devToolsExtension()
      : (f) => f
  )
);
