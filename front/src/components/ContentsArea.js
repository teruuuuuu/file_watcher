import * as React from 'react'
import { connect } from 'react-redux'

import { SettingItem } from './Contents/SettingItem'
import { saveSetting, delSetting, addTab, delTab } from '../redux/actions'
import { FileView } from './Contents/FileView'
import { FileSetting } from '../class/FileSetting'
import { ReadRequest } from '../class/ReadRequest'

import { ws } from '../App'

class ContentsArea extends React.Component {
  constructor(props) {
    super(props)
    const state = {}
  }

  componentDidUpdate(prevProps) {
    console.info(this.props)
    if (this.props.tabs.activeId != prevProps.tabs.activeId) {
      console.log("tab changed")
      const { settings, tabs } = this.props
      const activeSetting = settings.find(setting => setting.id == tabs.activeId) || new FileSetting({ id: -1 })
      ws.sendSettingFile(activeSetting)
      if (!activeSetting.tail) {
        this.readFile(50)
      }
    }
  }

  readFile(lineNum) {
    ws.sendReadRequest(new ReadRequest({ isBottom: true, lineNum: lineNum }))
  }

  delSetting(settingId) {
    this.props.delTab(settingId)
    this.props.delSetting(settingId)
  }
  saveSetting(setting) {
    this.props.saveSetting(setting)
  }

  addTab(settingId) {
    this.props.addTab(settingId == -1 ? this.props.settings.map(a => a.id).concat(-1).reduce((a, b) => Math.max(a, b)) + 1 : settingId)
  }

  settingView() {
    const { settings, tabs } = this.props
    return (
      <div className="setting-area" style={{ display: tabs.activeId == -1 ? "block" : "none" }}>
        <div className="list-item">
          {
            settings.map((setting) => <SettingItem key={setting.id} setting={setting} isAdd={false} del={(id) => this.delSetting(id)} saveSetting={(setting) => this.saveSetting(setting)} open={(settingId) => this.addTab(settingId)} />).concat(
              <SettingItem key={-1} setting={new FileSetting({ id: -1, name: "新規追加", isSftp: false, host: "", port: 22, user: "", password: "", filePath: "", charCode: "UTF-8", tail: false })}
                isAdd={true} del={(id) => this.delSetting(id)} saveSetting={(setting) => this.saveSetting(setting)} open={(settingId) => this.addTab(settingId)} />
            )
          }
        </div>
      </div>
    )
  }

  fileView() {
    const { settings, tabs } = this.props
    return (
      <div className="file-view-area" style={{ display: tabs.activeId != -1 ? "block" : "none" }}>
        {tabs.ids.filter(id => id != -1).map(id =>
          <FileView key={id} setting={settings.find(setting => setting.id == id)} isActive={id == tabs.activeId} readFile={(lineNum) => this.readFile(lineNum)}></FileView>)}
      </div>
    )
  }

  render() {
    return (
      <div className="contents">
        {this.settingView()}
        {this.fileView()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { settings, tabs } = state
  return { settings, tabs }
}
// export default VisibilityFilters;
export default connect(
  mapStateToProps,
  { saveSetting, delSetting, addTab, delTab }
)(ContentsArea)
