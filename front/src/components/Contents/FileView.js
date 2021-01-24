import React from "react";
import * as ReactDOM from "react-dom";
import cx from "classnames";
import { keyPressHandler, ws, searchSettingRepo } from "../../App";

import { ReadRequest } from "../../class/ReadRequest";

export class FileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.keyPressHandler = keyPressHandler;
    this.keyEvent = (e) => this.keyPress(e);
    this.fileResponse = (readResult) => this.readResultMethod(readResult);

    if (this.props.isActive) {
      this.tabActive();
    }
    searchSettingRepo.get(this.props.id, (d) => {
      if (d) {
        this.setState(d);
      }
    });
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.keyPressHandler.removeHandler(this.keyEvent);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isActive && !prevProps.isActive) {
      this.tabActive();
    } else if (!this.props.isActive && prevProps.isActive) {
      this.tabUnActive();
    }
  }

  tabActive() {
    this.keyPressHandler.addHandler(this.keyEvent);
    this.wsActive();
  }

  tabUnActive() {
    this.keyPressHandler.removeHandler(this.keyEvent);
    this.wsUnActive();
    this.setState(this.initialState());
  }

  wsActive() {
    const { setting, tail } = this.props;
    ws.addReadResultHandler(this.fileResponse);
    ws.sendSettingFile(setting);

    if (!tail) {
      this.readFile(50);
    }
  }

  wsUnActive() {
    ws.removeReadResultHandler(this.fileResponse);
  }

  readFile(lineNum) {
    ws.sendReadRequest(new ReadRequest({ isBottom: true, lineNum: lineNum }));
  }

  readResultMethod(readResult) {
    if (this.props.isActive) {
      console.info(readResult);
      this.setState({
        fileContent: this.state.fileContent.concat(readResult.lines),
      });
      if (this.props.setting.tail) {
        this.tail();
      }
    }
    this.setState({ bottomRequested: false });
  }

  initialState() {
    return {
      showFile: true,
      fileContent: [],
      fileViewIndex: 0,
      showSetting: false,
      showFind: false,
      findContent: [],
      findViewIndex: 0,
      forcusIsFile: true,
      bottomRequested: false,
      searchSelect: "regexp",
      searchSettingValues: [],
    };
  }

  tab() {
    const { showFile, showSetting, showFind } = this.state;
    const tabStyle = {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      width: "80%",
      paddingTop: "4px",
      zIndex: "1000",
      textAlign: "center",
      marginRight: "auto",
      marginLeft: "auto",
      color: "#DDD",
    };
    const fileStyle = {
      backgroundColor: showFile ? "#314ede" : "#778beb",
      border: "1px solid #546de5",
      borderBottomLeftRadius: "10px",
      borderTopLeftRadius: "10px",
      cursor: "pointer",
    };
    const searchStyle = {
      backgroundColor: showSetting ? "#314ede" : "#778beb",
      borderTop: "1px solid #546de5",
      borderBottom: "1px solid #546de5",
      cursor: "pointer",
    };
    const searchResultStyle = {
      backgroundColor: showFind ? "#314ede" : "#778beb",
      border: "1px solid #546de5",
      borderBottomRightRadius: "10px",
      borderTopRightRadius: "10px",
      cursor: "pointer",
    };

    return (
      <div style={tabStyle}>
        <div style={fileStyle} onClick={() => this.clickShowFile()}>
          file
        </div>
        <div style={searchStyle} onClick={() => this.clickShowSetting()}>
          検索条件
        </div>
        <div style={searchResultStyle} onClick={() => this.clickShowFind()}>
          検索結果
        </div>
      </div>
    );
  }

  fileView() {
    const { showFile, forcusIsFile, fileContent, fileViewIndex } = this.state;
    const fileStyle = {
      display: showFile ? "block" : "none",
      backgroundColor: "black",
      lineBreak: "anywhere",
      color: "#aef3a9",
      border: forcusIsFile ? "3px solid rgb(34 102 255)" : "1px solid #AAA",
      lineHeight: "16px",
      overflow: "hidden",
    };
    return (
      <div className="fileScroll" style={fileStyle}>
        {fileContent.slice(fileViewIndex).map((content, i) => (
          <div key={i} style={{ marginTop: "3px", minHeight: "16px" }}>
            {content}
          </div>
        ))}
      </div>
    );
  }

  searchSetting() {
    const { searchSettingValues } = this.state;
    const listItemStyle = {
      display: "grid",
      gridTemplateColumns: "1fr 30px",
      lineHeight: "30px",
      marginBottom: "2px",
    };
    const readTextStyle = {
      margin: "0px",
      height: "25px",
      resize: "unset",
      backgroundColor: "#DDD",
    };
    const editTextStyle = {
      margin: "0px",
      height: "25px",
      resize: "unset",
      backgroundColor: "#FFF",
      fontSize: "16px",
      verticalAlign: "middle",
      lineHeight: "25px",
    };
    const buttonStyle = {
      backgroundColor: "cornflowerblue",
      textAlign: "center",
      verticalAlign: "baseline",
      cursor: "pointer",
      color: "white",
      fontWeight: "bold",
    };
    const newLine = () => (
      <div style={listItemStyle}>
        <textarea readOnly style={readTextStyle}></textarea>
        <div style={buttonStyle} onClick={() => this.addSetting()}>
          +
        </div>
      </div>
    );
    const editLine = (setting, i) => (
      <div key={i} style={listItemStyle}>
        <textarea
          style={editTextStyle}
          value={setting}
          onChange={(e) => {
            this.changeSettings(i, e.target.value);
          }}
        ></textarea>
        <div style={buttonStyle} onClick={() => this.deleteSetting(i)}>
          -
        </div>
      </div>
    );

    return (
      <div
        style={{
          margin: "5px",
          height: "100%",
          overflowY: "auto",
        }}
      >
        {searchSettingValues.map((s, i) => editLine(s, i))}
        {newLine()}
      </div>
    );
  }

  searchView() {
    const { searchSelect, showSetting } = this.state;
    return (
      <div
        className="search"
        style={{
          display: showSetting ? "block" : "none",
          backgroundColor: "#aabade",
          overflow: "hidden",
        }}
      >
        <select
          className="search-select"
          value={searchSelect}
          onChange={(e) => this.changeSearch(e)}
        >
          <option value="---">---</option>
          <option value="regexp">正規表現</option>
          <option value="aaa">aaa</option>
        </select>
        {this.searchSetting()}
      </div>
    );
  }

  searchResultView() {
    const { showFind, forcusIsFile, findContent, findViewIndex } = this.state;
    const searchResultStyle = {
      display: showFind ? "block" : "none",
      backgroundColor: "black",
      lineBreak: "anywhere",
      color: "#aef3a9",
      border: !forcusIsFile ? "3px solid rgb(34 102 255)" : "1px solid #AAA",
      overflow: "hidden",
    };
    return (
      <div style={searchResultStyle}>
        {findContent.slice(findViewIndex).map((content, i) => (
          <div key={i} style={{ marginTop: "3px" }}>
            {content}
          </div>
        ))}
      </div>
    );
  }

  mainArea() {
    const { showFile, showSetting, showFind } = this.state;
    const mainStyle = {
      display: "grid",
      gridTemplateColumns: "1fr "
        .repeat([showFile, showSetting, showFind].filter((a) => a).length)
        .trim(),
      backgroundColor: "#CCC",
      margin: "8px",
      padding: "2px",
      paddingTop: "15px",
      overflow: "hidden",
    };
    return (
      <div style={mainStyle}>
        {this.fileView()}
        {this.searchView()}
        {this.searchResultView()}
      </div>
    );
  }

  render() {
    const { isActive } = this.props;
    const fileViewStyle = {
      display: isActive ? "grid" : "none",
      height: "100%",
      gridTemplateRows: "10px 1fr",
    };
    return (
      <div style={fileViewStyle}>
        {this.tab()}
        {this.mainArea()}
      </div>
    );
  }

  tail() {
    const fileScroll = ReactDOM.findDOMNode(this).getElementsByClassName(
      "fileScroll"
    )[0];
    fileScroll.scrollTop = fileScroll.scrollHeight;
  }

  clickShowFile() {
    const { showFile, forcusIsFile, showFind } = this.state;
    this.setState({
      showFile: !showFile,
      forcusIsFile: !(!forcusIsFile || (showFile && showFind)),
    });
  }

  clickShowSetting() {
    const { showSetting, showFind } = this.state;
    this.setState({ showSetting: !showSetting });
  }

  clickShowFind() {
    const { showFile, showFind } = this.state;
    this.setState({ showFind: !showFind, forcusIsFile: showFile || showFind });
  }

  changeSearch(e) {
    const { id, searchSettingValues } = this.state;
    this.setState({ searchSelect: e.target.value });
    this.saveSearchSetting(id, e.target.value, searchSettingValues);
  }

  changeSettings(i, setting) {
    const { id, searchSelect, searchSettingValues } = this.state;
    const newSearchSettingValues = searchSettingValues
      .splice(0, i)
      .concat([setting])
      .concat(searchSettingValues.splice(i + 1));
    this.setState({
      searchSettingValues: newSearchSettingValues,
    });
    this.saveSearchSetting(id, searchSelect, newSearchSettingValues);
  }
  addSetting() {
    const { id, searchSelect, searchSettingValues } = this.state;
    const newSearchSettingValues = searchSettingValues.concat([""]);
    this.setState({ searchSettingValues: newSearchSettingValues });
    this.saveSearchSetting(id, searchSelect, newSearchSettingValues);
  }
  deleteSetting(i) {
    const { id, searchSelect, searchSettingValues } = this.state;
    const newSearchSettingValues = searchSettingValues
      .splice(0, i)
      .concat(searchSettingValues.splice(i + 1));
    this.setState({
      searchSettingValues: newSearchSettingValues,
    });
    this.saveSearchSetting(id, searchSelect, newSearchSettingValues);
  }

  saveSearchSetting(id, searchSelect, searchSettingValues) {
    searchSettingRepo.save({
      id: id,
      searchSelect: searchSelect,
      searchSettingValues: searchSettingValues,
    });
  }

  keyPress(e) {
    const { isActive } = this.props;
    const { tail } = this.props.setting;
    const {
      showFile,
      showFind,
      forcusIsFile,
      fileContent,
      fileViewIndex,
      findContent,
      findViewIndex,
    } = this.state;

    if (isActive) {
      if (e.key == "l" && showFind) {
        this.setState({ forcusIsFile: false });
      } else if (e.key == "h" && showFile) {
        this.setState({ forcusIsFile: true });
      } else if (e.key == "j" && !tail) {
        if (
          showFile &&
          forcusIsFile &&
          fileContent.length > fileViewIndex + 1
        ) {
          this.setState({ fileViewIndex: fileViewIndex + 1 });
          if (
            fileContent.length - fileViewIndex < 25 &&
            !this.state.bottomRequested
          ) {
            this.readFile(50);
            this.setState({ bottomRequested: true });
          }
        } else if (
          showFind &&
          !forcusIsFile &&
          findContent.length > findViewIndex + 1
        ) {
          this.setState({ findViewIndex: findViewIndex + 1 });
        }
      } else if (e.key == "k" && !tail) {
        if (showFile && forcusIsFile && fileViewIndex > 0) {
          this.setState({ fileViewIndex: fileViewIndex - 1 });
        } else if (showFind && !forcusIsFile && findViewIndex > 0) {
          this.setState({ findViewIndex: findViewIndex - 1 });
        }
      }
    }
  }
}
