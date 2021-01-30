import React from "react";
import * as ReactDOM from "react-dom";
import cx from "classnames";
import {
  keyPressHandler,
  ws,
  fileCacheRepo,
  searchSettingRepo,
} from "../../App";

import { ReadRequest } from "../../class/ReadRequest";

export class FileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.keyPressHandler = keyPressHandler;
    this.keyEvent = (e) => this.keyPress(e);
    this.fileResponse = (readResult) => this.readResultMethod(readResult);
    // 描画対象行数
    this.VIEW_LENGTH = 100;
    // キャッシュ単位
    this.CACHE_UNIT = 300;
    // 最大キャッシュ
    this.CACHE_MAX = 1200;

    // テキストのキャッシュ
    this.fileCache = [];
    // キャッシュの開始行
    this.cacheIndex = 0;
    this.viewIndex = 0;
    // リクエスト中かどうか
    this.readRequested = false;
    // 最後までキャッシュされたかどうか
    this.reachBottom = false;
    // 最終行
    this.lastIndex = -1;

    if (this.props.isActive) {
      // ファイル選択時
      this.tabActive();
    }
    searchSettingRepo.get(this.props.id, (d) => {
      if (d) {
        this.setState(d);
      }
    });

    this.scrollIntervalEvId = undefined;
    this.saveSearchSettingEvId = undefined;

    fileCacheRepo.clear();
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.keyPressHandler.removeHandler(this.keyEvent);
    clearTimeout(this.saveSearchSettingEvId);
    clearInterval(this.scrollIntervalEvId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isActive && !prevProps.isActive) {
      this.tabActive();
    } else if (!this.props.isActive && prevProps.isActive) {
      this.tabUnActive();
    }

    if (this.props.setting.tail) {
      this.tail();
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
    const { setting } = this.props;
    ws.addReadResultHandler(this.fileResponse);
    ws.sendSettingFile(setting);

    if (!setting.tail) {
      this.readFile(300);
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
      if (!this.props.setting.tail) {
        const { fileViewIndex } = this.state;
        // 表示業のキャッシュ内のインデックス
        const cacheViewIndex = fileViewIndex - this.cacheIndex;
        this.fileCache = this.fileCache.concat(readResult.lines);
        const newContent = this.fileCache.slice(
          cacheViewIndex,
          cacheViewIndex + this.VIEW_LENGTH
        );
        this.setState({
          fileContent: newContent,
        });
        if (this.props.setting.tail) {
          this.tail();
        }
        if (readResult.lines.length == 0) {
          this.reachBottom = true;
          this.lastIndex = this.cacheIndex + this.fileCache.length;
        } else {
          fileCacheRepo.save(readResult);
        }
      } else {
        this.fileCache = this.fileCache
          .concat(readResult.lines)
          .slice(-this.VIEW_LENGTH);
        this.setState({
          fileContent: this.fileCache,
        });
      }
      this.readRequested = false;
    }
  }

  initialState() {
    return {
      showFile: true,
      showSetting: false,
      showFind: false,
      // 表示中の開始行
      fileViewIndex: 0,
      // ファイル内容表示用
      fileContent: [],
      findViewIndex: 0,
      findContent: [],
      scrollSelect: 0,
      // forcusIsFile: true,
      // bottomRequested: false,
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
    const { tail } = this.props.setting;
    const { showFile, fileContent, fileViewIndex, scrollSelect } = this.state;
    const scrollColors = !tail
      ? ["#778093", "#596275", "#303952", "#1f2535"]
      : ["#778093", "#778093", "#778093", "#778093"];
    const fileStyle = {
      display: showFile ? "block" : "none",
      backgroundColor: "black",
      lineBreak: "anywhere",
      color: "rgb(154 174 153)",
      border: "3px solid rgb(34 102 255)",
      lineHeight: "16px",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "1fr 20px",
    };
    const scrollBarStyle = {
      backgroundColor: "#CCC",
      display: "grid",
      gridTemplateRows: "1fr 1fr 1fr",
      fontWeight: "bold",
      color: "aliceblue",
    };
    const scrollStyle = {
      margin: "1px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      flexDirection: "column",
      userSelect: "none",
    };

    return (
      <div style={fileStyle} onScroll={(e) => this.scrollFileEvent(e)}>
        <div className="fileScroll" style={{ overflow: "hidden" }}>
          <div
            style={{
              backgroundColor: "#CCC",
              color: "black",
              display: !tail ? "block" : "none",
            }}
          >
            line:{fileViewIndex}
          </div>
          <div>
            {fileContent.map((content, i) => (
              <div key={i} style={{ marginTop: "3px", minHeight: "16px" }}>
                {content}
              </div>
            ))}
          </div>
        </div>
        <div className="fileScrollBar" style={scrollBarStyle}>
          <div
            style={Object.assign(
              {},
              scrollStyle,
              tail ? { cursor: "auto" } : {},
              {
                backgroundColor:
                  scrollColors[Math.abs(Math.min(scrollSelect, 0))],
              }
            )}
            onClick={(e) => this.scrollClick(-1)}
          >
            ↑
          </div>
          <div
            style={Object.assign(
              {},
              scrollStyle,
              tail ? { cursor: "auto" } : {},
              scrollSelect == 0
                ? { backgroundColor: scrollColors[3] }
                : { backgroundColor: scrollColors[0] }
            )}
            onClick={(e) => this.scrollClick(0)}
          >
            □
          </div>
          <div
            style={Object.assign(
              {},
              scrollStyle,
              {
                backgroundColor:
                  scrollColors[Math.abs(Math.max(scrollSelect, 0))],
              },
              tail ? { cursor: "auto", backgroundColor: "#1f2535" } : {}
            )}
            onClick={(e) => this.scrollClick(1)}
          >
            ↓
          </div>
        </div>
      </div>
    );
  }

  scrollClick(direction) {
    if (this.props.setting.tail) {
      // tailで開いたときはスクロール操作無効
    } else {
      const { scrollSelect } = this.state;

      const intervals = [250, 100, 10];
      if (direction == 0 && scrollSelect != 0) {
        // 停止
        if (typeof this.scrollIntervalEvId === "number") {
          clearInterval(this.scrollIntervalEvId);
        }
        this.setState({ scrollSelect: 0 });
      } else if (direction == -1 && scrollSelect >= -2) {
        // 上クリック
        if (typeof this.scrollIntervalEvId === "number") {
          clearInterval(this.scrollIntervalEvId);
        }
        // スクロールボタン描画反映
        const newSelect = Math.min(scrollSelect - 1, -1);
        this.setState({ scrollSelect: newSelect });

        // スクロールイベント登録
        this.scrollIntervalEvId = setInterval(() => {
          const { fileViewIndex } = this.state;
          if (this.fileCache.length > this.CACHE_MAX) {
            // キャッシュ調整
            this.fileCache = this.fileCache.slice(0, this.CACHE_MAX);
          }

          const newIndex = Math.max(fileViewIndex - 1, this.cacheIndex);
          const cacheViewIndex = newIndex - this.cacheIndex;
          const fileContent = this.fileCache.slice(
            cacheViewIndex,
            cacheViewIndex + this.VIEW_LENGTH
          );
          this.setState({ fileViewIndex: newIndex, fileContent: fileContent });

          if (this.cacheIndex != 0 && cacheViewIndex <= this.VIEW_LENGTH) {
            // キャッシュに追加が必要な場合
            fileCacheRepo.get(this.cacheIndex - this.CACHE_UNIT, (data) => {
              // IndexedDBから読み込んだものを先頭に追加
              this.cacheIndex -= this.CACHE_UNIT;
              this.fileCache = data.lines.concat(this.fileCache);
            });
          }
        }, intervals[Math.abs(newSelect) - 1]);
      } else if (direction == 1 && scrollSelect <= 2) {
        // 下クリック
        if (typeof this.scrollIntervalEvId === "number") {
          clearInterval(this.scrollIntervalEvId);
        }
        // スクロールボタン描画反映
        const newSelect = Math.max(scrollSelect + 1, 1);
        this.setState({ scrollSelect: newSelect });

        // スクロールイベント登録
        this.scrollIntervalEvId = setInterval(() => {
          console.info(this.fileCache.length);
          const { fileViewIndex } = this.state;
          const newIndex = Math.min(
            Math.max(fileViewIndex + 1, this.cacheIndex),
            this.cacheIndex + this.fileCache.length - 1
          );
          if (this.fileCache.length > this.CACHE_MAX) {
            // キャッシュ調整
            this.cacheIndex += this.CACHE_UNIT;
            this.fileCache = this.fileCache.slice(this.CACHE_UNIT);
          }
          const cacheViewIndex = newIndex - this.cacheIndex;
          const fileContent = this.fileCache.slice(
            cacheViewIndex,
            cacheViewIndex + 100
          );
          this.setState({ fileViewIndex: newIndex, fileContent: fileContent });

          if (
            this.fileCache.length - (cacheViewIndex + this.VIEW_LENGTH) <
            this.VIEW_LENGTH
          ) {
            // キャッシュ更新が必要な場合
            if (
              this.readRequested ||
              (this.lastIndex != -1 &&
                this.cacheIndex + this.fileCache.length == this.lastIndex)
            ) {
              // ファイル読み込み中なら何もしない
              // 最後まで到達しても何もしない
              console.info(this.lastIndex);
            } else {
              fileCacheRepo.get(
                this.cacheIndex + this.fileCache.length,
                (data) => {
                  if (data == undefined) {
                    // IndexedDBに存在しないのでファイル読み込み
                    this.readFile(this.CACHE_UNIT);
                  } else {
                    // IndexedDBに存在したのでキャッシュに追加
                    this.fileCache = this.fileCache.concat(data.lines);
                  }
                }
              );
            }
          }
        }, intervals[Math.abs(newSelect) - 1]);
      }
    }
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
          <option value="regexp">正規表現</option>
        </select>
        {this.searchSetting()}
      </div>
    );
  }

  searchResultView() {
    const { showFind, findContent, findViewIndex } = this.state;
    const searchResultStyle = {
      display: showFind ? "block" : "none",
      backgroundColor: "white",
      lineBreak: "anywhere",
      color: "#aef3a9",
      border: "3px solid rgb(224 224 224)",
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
    this.setState({ showFile: !this.state.showFile });
  }

  clickShowSetting() {
    this.setState({ showSetting: !this.state.showSetting });
  }

  clickShowFind() {
    this.setState({ showFind: !this.state.showFind });
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
    if (typeof this.saveSearchSettingEvId === "number") {
      clearTimeout(this.saveSearchSettingEvId);
    }
    this.saveSearchSettingEvId = setTimeout(() => {
      const state = {
        id: id,
        searchSelect: searchSelect,
        searchSettingValues: searchSettingValues,
      };
      searchSettingRepo.save(state);
      this.saveSearchSettingEvId = undefined;
      ws.sendSearchRequest(state);
    }, 3000);
  }

  scrollFileEvent(e) {
    const { clientHeight, scrollTop, scrollHeight } = e.target;
    if (scrollTop == 0) {
      // 上に追加
    } else if (
      scrollHeight - (scrollTop + clientHeight) <= 100 &&
      !this.readRequested
    ) {
      // 下に追加
      this.readFile(100);
      this.readRequested = true;
    }
  }

  keyPress(e) {
    //   const { isActive } = this.props;
    //   const { tail } = this.props.setting;
    //   const {
    //     showFile,
    //     showFind,
    //     forcusIsFile,
    //     fileContent,
    //     fileViewIndex,
    //     findContent,
    //     findViewIndex,
    //   } = this.state;
    //   if (isActive) {
    //     if (e.key == "l" && showFind) {
    //       this.setState({ forcusIsFile: false });
    //     } else if (e.key == "h" && showFile) {
    //       this.setState({ forcusIsFile: true });
    //     } else if (e.key == "j" && !tail) {
    //       if (
    //         showFile &&
    //         forcusIsFile &&
    //         fileContent.length > fileViewIndex + 1
    //       ) {
    //         this.setState({ fileViewIndex: fileViewIndex + 1 });
    //         if (
    //           fileContent.length - fileViewIndex < 50 &&
    //           !this.state.bottomRequested
    //         ) {
    //           this.readFile(100);
    //           this.setState({ bottomRequested: true });
    //         }
    //       } else if (
    //         showFind &&
    //         !forcusIsFile &&
    //         findContent.length > findViewIndex + 1
    //       ) {
    //         this.setState({ findViewIndex: findViewIndex + 1 });
    //       }
    //     } else if (e.key == "k" && !tail) {
    //       if (showFile && forcusIsFile && fileViewIndex > 0) {
    //         this.setState({ fileViewIndex: fileViewIndex - 1 });
    //       } else if (showFind && !forcusIsFile && findViewIndex > 0) {
    //         this.setState({ findViewIndex: findViewIndex - 1 });
    //       }
    //     }
    //   }
  }
}
