import React from 'react'
import * as ReactDOM from 'react-dom'
import cx from 'classnames'
import { keyPressHandler, ws } from '../../App'

import { ReadRequest } from '../../class/ReadRequest'

export class FileView extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.initialState()
    this.keyPressHandler = keyPressHandler
    this.keyEvent = (e) => this.keyPress(e)
    this.fileResponse = (readResult) => this.readResultMethod(readResult)

    if (this.props.isActive) {
      this.tabActive()
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.keyPressHandler.removeHandler(this.keyEvent)
  }

  componentDidUpdate(prevProps) {
    if (this.props.isActive && !prevProps.isActive) {
      this.tabActive()
    } else if (!this.props.isActive && prevProps.isActive) {
      this.tabUnActive()
    }
  }

  tabActive() {
    this.keyPressHandler.addHandler(this.keyEvent)
    this.wsActive()
  }

  tabUnActive() {
    this.keyPressHandler.removeHandler(this.keyEvent)
    this.wsUnActive()
    this.setState(this.initialState())
  }

  wsActive() {
    const { setting, tail } = this.props
    ws.addReadResultHandler(this.fileResponse)
    ws.sendSettingFile(setting)

    if (!tail) {
      this.readFile(50)
    }
  }

  wsUnActive() {
    ws.removeReadResultHandler(this.fileResponse)
  }

  readFile(lineNum) {
    ws.sendReadRequest(new ReadRequest({ isBottom: true, lineNum: lineNum }))
  }

  readResultMethod(readResult) {
    if (this.props.isActive) {
      console.info(readResult)
      this.setState({ fileContent: this.state.fileContent.concat(readResult.lines) })
      if (this.props.setting.tail) {
        this.tail()
      }
    }
    this.setState({ bottomRequested: false })
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
      bottomRequested: false
    }
  }

  tab() {
    const { showFile, showSetting, showFind } = this.state

    return (
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", width: "80%", paddingTop: "4px",
        zIndex: "1000", textAlign: "center", marginRight: "auto", marginLeft: "auto", color: "#DDD"
      }}>
        <div style={{ backgroundColor: showFile ? "#314ede" : "#778beb", border: "1px solid #546de5", borderBottomLeftRadius: "10px", borderTopLeftRadius: "10px", cursor: "pointer" }} onClick={() => this.clickShowFile()}>file</div>
        <div style={{ backgroundColor: showSetting ? "#314ede" : "#778beb", borderTop: "1px solid #546de5", borderBottom: "1px solid #546de5", cursor: "pointer" }} onClick={() => this.clickShowSetting()}>検索条件</div>
        <div style={{ backgroundColor: showFind ? "#314ede" : "#778beb", border: "1px solid #546de5", borderBottomRightRadius: "10px", borderTopRightRadius: "10px", cursor: "pointer" }} onClick={() => this.clickShowFind()}>検索結果</div>
      </div>
    )
  }

  mainArea() {
    const { setting, isActive } = this.props
    const { showFile, showSetting, showFind, forcusIsFile, fileContent, fileViewIndex, findContent, findViewIndex } = this.state

    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr ".repeat([showFile, showSetting, showFind].filter(a => a).length).trim(), backgroundColor: "#CCC", margin: "8px", padding: "2px", paddingTop: "15px", overflow: "hidden" }}>
        <div className="fileScroll" style={{ display: showFile ? "block" : "none", backgroundColor: "black", lineBreak: "anywhere", color: "#aef3a9", border: forcusIsFile ? "3px solid rgb(34 102 255)" : "1px solid #AAA", lineHeight: "16px", overflow: "hidden" }}>
          {fileContent.slice(fileViewIndex).map((content, i) => <div key={i} style={{ marginTop: "3px", minHeight: "16px" }}>{content}</div>)}
        </div>
        <div style={{ display: showSetting ? "grid" : "none", backgroundColor: "white", border: "1px solid #AAA", gridTemplateRows: "1fr 30px" }}>
          <textarea style={{ resize: "none" }}></textarea>
          <div style={{ backgroundColor: "#f7d794", border: "1px solid #f5cd79", width: "100%", textAlign: "center", cursor: "pointer", color: "#222" }}>確定</div>
        </div>
        <div style={{ display: showFind ? "block" : "none", backgroundColor: "black", lineBreak: "anywhere", color: "#aef3a9", border: !forcusIsFile ? "3px solid rgb(34 102 255)" : "1px solid #AAA", overflow: "hidden" }}>
          {findContent.slice(findViewIndex).map((content, i) => <div key={i} style={{ marginTop: "3px" }}>{content}</div>)}
        </div>
      </div>
    )
  }

  render() {
    const { setting, isActive } = this.props
    return (
      <div style={{ display: isActive ? "grid" : "none", height: "100%", gridTemplateRows: "10px 1fr" }}>
        {this.tab()}
        {this.mainArea()}
      </div>
    )
  }

  tail() {
    const fileScroll = ReactDOM.findDOMNode(this).getElementsByClassName("fileScroll")[0]
    fileScroll.scrollTop = fileScroll.scrollHeight
  }

  clickShowFile() {
    const { showFile, forcusIsFile, showFind } = this.state
    this.setState({ showFile: !showFile, forcusIsFile: !(!forcusIsFile || (showFile && showFind)) })
  }

  clickShowSetting() {
    const { showSetting, showFind } = this.state
    this.setState({ showSetting: !showSetting })
  }

  clickShowFind() {
    const { showFile, showFind } = this.state
    this.setState({ showFind: !showFind, forcusIsFile: showFile || showFind })
  }

  keyPress(e) {
    const { isActive } = this.props
    const { tail } = this.props.setting
    const { showFile, showFind, forcusIsFile, fileContent, fileViewIndex, findContent, findViewIndex } = this.state

    if (isActive) {
      if (e.key == "l" && showFind) {
        this.setState({ forcusIsFile: false })
      } else if (e.key == "h" && showFile) {
        this.setState({ forcusIsFile: true })
      } else if (e.key == "j" && !tail) {
        if (showFile && forcusIsFile && fileContent.length > fileViewIndex + 1) {
          this.setState({ fileViewIndex: fileViewIndex + 1 })
          if (fileContent.length - fileViewIndex < 25 && !this.state.bottomRequested) {
            this.readFile(50)
            this.setState({ bottomRequested: true })
          }
        } else if (showFind && !forcusIsFile && findContent.length > findViewIndex + 1) {
          this.setState({ findViewIndex: findViewIndex + 1 })
        }
      } else if (e.key == "k" && !tail) {
        if (showFile && forcusIsFile && fileViewIndex > 0) {
          this.setState({ fileViewIndex: fileViewIndex - 1 })
        } else if (showFind && !forcusIsFile && findViewIndex > 0) {
          this.setState({ findViewIndex: findViewIndex - 1 })
        }
      }
    }
  }
}
