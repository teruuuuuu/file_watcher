/*global ENV */
import * as React from "react";
import Header from "./components/Header";
import ContentsArea from "./components/ContentsArea";
import { connect } from "react-redux";
import { KeyPressHandler } from "./event/keypressHandler";
import { WindowResizeHandler } from "./event/WindowResizeHandler";
import { WS } from "./Ws/Ws";
import { FileSettingRepo } from "./repository/FileSettingRepo";
import { SearchSettingRepo } from "./repository/SearchSettingRepo";
import { DbService } from "./repository/DbService";

import "./style/global.less";

export const keyPressHandler = new KeyPressHandler(window.document);
export const windowResizeHandler = new WindowResizeHandler();
export const env = ENV;
export const dbService = new DbService();
export const fileSettingRepo = new FileSettingRepo(dbService);
export const searchSettingRepo = new SearchSettingRepo(dbService);
dbService.init();

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const appStyle = {
      width: "100%",
      height: "100vh",
      display: "grid",
      gridTemplateRows: "20px 1fr",
    };
    return (
      <div style={appStyle}>
        <Header />
        <ContentsArea />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { state };
};
// export default VisibilityFilters;
export default connect(mapStateToProps)(App);

export const ws = new WS(env.WsUrl, env.hbInterval);
