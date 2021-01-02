import React, { useState } from 'react'
import * as ReactDOM from 'react-dom'
import cx from "classnames"

export class SettingItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = Object.assign({}, props, { isShow: false, leftPosi: 0, topPosi: 0 })
  }

  show(target) {
    const clientRect = ReactDOM.findDOMNode(this).getBoundingClientRect(target)
    this.setState({ isShow: true, leftPosi: clientRect.left, topPosi: clientRect.top })
  }

  close() {
    this.setState({ isShow: false })
  }

  del() {
    const id = this.state.setting.id
    this.props.del(id)
  }

  save() {
    const { name, isSftp, host, port, user, password, filePath, tail } = this.state.setting
    if (name.trim().length == 0 || filePath.trim().length == 0 || (isSftp && host.trim().length == 0) ||
      (isSftp && Number.isInteger(port) && port <= 0) || (isSftp && user.trim().length == 0) || (isSftp && password.trim().length == 0)) {
      alert("入力に不備があります")
    } else {
      this.props.saveSetting(this.state.setting)
      if (this.state.setting.id == -1) {
        this.setState(Object.assign({}, this.state, {
          setting: Object.assign({}, this.state.setting, {
            name: "新規追加", isSftp: false, host: "", port: 22, user: "", password: "", filePath: "", charCode: "UTF-8", tail: false
          })
        }))
      }
      this.close()
    }
  }

  open() {
    const id = this.state.setting.id
    this.save()
    this.props.open(id)
  }

  itemView() {
    const { name } = this.state.setting
    const { isAdd } = this.state

    const header = (isAdd) => <div></div>

    return (
      <div className={cx(
        "setting-item", isAdd && "add"
      )}>
        <div>
          {header(isAdd)}
        </div>
        <div onClick={(e) => this.show(e.target)} style={{ cursor: "pointer", lineBreak: "anywhere", overflow: "hidden" }}>
          {name}
        </div>
      </div >
    )
  }
  openView() {
    const { id, name, isSftp, host, port, user, password, filePath, charCode, tail } = this.state.setting
    const { leftPosi, topPosi } = this.state
    return (
      <div className={cx(
        "setting-item", "open"
      )} style={{
        transitionDuration: "300ms", zIndex: "1000",
        transform: `translateX(${-leftPosi + (window.innerWidth - 500) / 2}px) translateY(${-topPosi + 28}px)`,
        top: `${topPosi}px`, left: `${leftPosi}px`, width: "500px", height: "400px", backgroundColor: "#f3a683"
      }} >
        <div style={{ margin: "30px", margin: "30px", fontSize: "18px", position: "static" }}>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr" }}>
            <label style={{ textAlign: "right" }}>名前:</label>
            <input type="text" style={{ marginLeft: "20px", width: "335px", height: "25px", border: "none" }}
              value={name} onChange={(e) => this.setName(e.target.value)}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", marginTop: "5px" }}>
            <label style={{ textAlign: "right" }}>対象:</label>
            <div style={{ width: "360px", height: "25px", border: "none", fontSize: "16px", display: "inline-flex", color: "white", textAlign: "center" }}>
              <div onClick={() => this.setSftp(false)} style={{ marginLeft: "20px", width: "170px", "height": "30px", lineHeight: "30px", cursor: "pointer", backgroundColor: !isSftp ? "#303952" : "#596275" }}>ローカルホスト</div>
              <div onClick={() => this.setSftp(true)} style={{ marginLeft: "3px", width: "170px", "height": "30px", lineHeight: "30px", cursor: "pointer", backgroundColor: isSftp ? "#303952" : "#596275" }}>sftp</div>
            </div>
          </div>
          <div style={{ display: isSftp ? "grid" : "none", gridTemplateColumns: "80px 1fr", marginTop: "5px" }}>
            <label style={{ textAlign: "right" }}>ホスト:</label>
            <input type="text" style={{ marginLeft: "20px", width: "335px", height: "25px", border: "none" }}
              value={host} onChange={(e) => this.setHost(e.target.value)}
            />
          </div>
          <div style={{ display: isSftp ? "grid" : "none", gridTemplateColumns: "80px 1fr", marginTop: "5px" }}>
            <label style={{ textAlign: "right" }}>ポート:</label>
            <input type="text" style={{ marginLeft: "20px", width: "335px", height: "25px", border: "none" }}
              value={port} onChange={(e) => this.setPort(e.target.value)}
            />
          </div>
          <div style={{ display: isSftp ? "grid" : "none", gridTemplateColumns: "80px 1fr", marginTop: "5px" }}>
            <label style={{ textAlign: "right" }}>ユーザ:</label>
            <input type="text" style={{ marginLeft: "20px", width: "335px", height: "25px", border: "none" }}
              value={user} onChange={(e) => this.setUser(e.target.value)}
            />
          </div>
          <div style={{ display: isSftp ? "grid" : "none", gridTemplateColumns: "80px 1fr", marginTop: "5px" }}>
            <label style={{ textAlign: "right", fontSize: "15px", lineHeight: "29px" }}>パスワード:</label>
            <input type="text" style={{ marginLeft: "20px", width: "335px", height: "25px", border: "none" }}
              value={password} onChange={(e) => this.setPassword(e.target.value)}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", marginTop: "5px" }}>
            <label style={{ textAlign: "right" }}>FilePath:</label>
            <input type="text" style={{ marginLeft: "20px", width: "335px", height: "25px", border: "none" }}
              value={filePath} onChange={(e) => this.setFilePath(e.target.value)}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", marginTop: "5px" }}>
            <label style={{ textAlign: "right" }}>CharCode:</label>
            <input type="text" style={{ marginLeft: "20px", width: "335px", height: "25px", border: "none" }}
              value={charCode} onChange={(e) => this.setCharCode(e.target.value)}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", marginTop: "5px" }}>
            <label style={{ textAlign: "right" }}>tail:</label>
            <div style={{ width: "360px", height: "25px", border: "none", fontSize: "16px", display: "inline-flex", color: "white", textAlign: "center" }}>
              <div onClick={() => this.setTail(true)} style={{ marginLeft: "20px", width: "170px", "height": "30px", lineHeight: "30px", cursor: "pointer", backgroundColor: tail ? "#303952" : "#596275" }}>ON</div>
              <div onClick={() => this.setTail(false)} style={{ marginLeft: "3px", width: "170px", "height": "30px", lineHeight: "30px", cursor: "pointer", backgroundColor: !tail ? "#303952" : "#596275" }}>OFF</div>
            </div>
          </div>
          <div style={{ display: "inline-flex", float: "right", marginTop: "20px", color: "white", fontSize: "20px", textAlign: "center" }}>
            <div onClick={() => this.del()} style={{ display: id != -1 ? "block" : "none", width: "80px", height: "35px", lineHeight: "35px", marginLeft: "5px", cursor: "pointer", backgroundColor: "#303952" }}>削除</div>
            <div onClick={() => this.close()} style={{ width: "80px", height: "35px", lineHeight: "35px", marginLeft: "5px", cursor: "pointer", backgroundColor: "#303952" }}>閉じる</div>
            <div onClick={() => this.save()} style={{ width: "80px", height: "35px", lineHeight: "35px", marginLeft: "5px", cursor: "pointer", backgroundColor: "#303952" }}>保存</div>
            <div onClick={() => this.open()} style={{ width: "80px", height: "35px", lineHeight: "35px", marginLeft: "5px", cursor: "pointer", backgroundColor: "#303952" }}>開く</div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return this.state.isShow ? this.openView() : this.itemView()
  }
  setName(name) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { name: name })
    }))
  }
  setSftp(isSftp) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { isSftp: isSftp })
    }))
  }
  setHost(host) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { host: host })
    }))
  }
  setPort(port) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { port: port })
    }))
  }
  setUser(user) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { user: user })
    }))
  }
  setPassword(password) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { password: password })
    }))
  }
  setFilePath(filePath) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { filePath: filePath })
    }))
  }
  setCharCode(charCode) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { charCode: charCode })
    }))
  }
  setTail(tail) {
    this.setState(Object.assign({}, this.state, {
      setting: Object.assign({}, this.state.setting, { tail: tail })
    }))
  }
}

// export default SettingItem
