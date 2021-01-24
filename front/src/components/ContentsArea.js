import * as React from "react";
import { connect } from "react-redux";

import { SettingItem } from "./Contents/SettingItem";
import { saveSetting, delSetting, addTab, delTab } from "../redux/actions";
import { FileView } from "./Contents/FileView";
import { FileSetting } from "../class/FileSetting";
import { fileSettingRepo } from "../App";

class ContentsArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { whiteout: 0 };

    fileSettingRepo.getAll((d) => this.props.saveSetting(d));
  }

  componentDidUpdate(prevProps) {}

  delSetting(settingId) {
    this.props.delTab(settingId);
    this.props.delSetting(settingId);
  }
  saveSetting(setting, isOpen) {
    const settingIdGen = (settingId) =>
      settingId == -1
        ? this.props.fileSettings
            .map((a) => a.id)
            .concat(-1)
            .reduce((a, b) => Math.max(a, b)) + 1
        : settingId;
    this.props.saveSetting(
      Object.assign({}, setting, { id: settingIdGen(setting.id) }),
      isOpen
    );
  }

  addTab(settingId) {
    this.props.addTab(settingId);
  }

  whiteoutOn() {
    this.setState({ whiteout: 1 });
  }

  whiteoutOff() {
    this.setState({ whiteout: 0 });
  }

  settingView() {
    const { fileSettings, tabs } = this.props;
    const { whiteout } = this.state;
    const delMehtod = (id) => this.delSetting(id);
    const saveMethod = (setting, isOpen) => this.saveSetting(setting, isOpen);
    return (
      <div
        className="setting-area"
        style={{ display: tabs.activeId == -1 ? "block" : "none" }}
      >
        <div className="list-item">
          {fileSettings
            .map((setting) => (
              <SettingItem
                key={setting.id}
                setting={setting}
                isAdd={false}
                del={delMehtod}
                saveSetting={saveMethod}
                open={(settingId) => this.addTab(settingId)}
                whiteoutOn={() => this.whiteoutOn()}
                whiteoutOff={() => this.whiteoutOff()}
              />
            ))
            .concat(
              <SettingItem
                key={-1}
                setting={
                  new FileSetting({
                    id: -1,
                    name: "新規追加",
                    isSftp: false,
                    host: "",
                    port: 22,
                    user: "",
                    password: "",
                    filePath: "",
                    charCode: "UTF-8",
                    tail: false,
                  })
                }
                isAdd={true}
                del={delMehtod}
                saveSetting={saveMethod}
                open={(settingId) => this.addTab(settingId)}
                whiteoutOn={() => this.whiteoutOn()}
                whiteoutOff={() => this.whiteoutOff()}
              />
            )}
        </div>
        <div
          style={{
            display: whiteout == 1 ? "block" : "none",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            position: "absolute",
            top: "20px",
            bottom: "0",
            left: "0",
            right: "0",
            zIndex: "100",
            backdropFilter: "blur(1px)",
          }}
        />
      </div>
    );
  }

  fileView() {
    const { fileSettings, tabs } = this.props;
    return (
      <div
        className="file-view-area"
        style={{ display: tabs.activeId != -1 ? "block" : "none" }}
      >
        {tabs.ids
          .filter((id) => id != -1)
          .map((id) => (
            <FileView
              key={id}
              id={id}
              setting={fileSettings.find((setting) => setting.id == id)}
              isActive={id == tabs.activeId}
            ></FileView>
          ))}
      </div>
    );
  }

  render() {
    return (
      <div className="contents">
        {this.settingView()}
        {this.fileView()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { fileSettings, tabs } = state;
  return { fileSettings, tabs };
};

export default connect(mapStateToProps, {
  saveSetting,
  delSetting,
  addTab,
  delTab,
})(ContentsArea);
