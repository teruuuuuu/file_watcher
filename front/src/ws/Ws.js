import { ReadResult } from "../class/ReadResult"

const RecordSeparator = String.fromCharCode(30)

export class WS {
  constructor(url, hbInterval) {
    this.socket = new WebSocket(url)
    this.socket.addEventListener('message', (e) => this.onMessage(e))
    this.counter = { count: 0 }
    setInterval(() => {
      this.sendMessage("HeartBeat", Object.assign(this.counter, { count: this.counter.count + 1 }))
    }, hbInterval)
    this.readResulthandlers = []
  }

  addReadResultHandler(handler) {
    this.readResulthandlers.push(handler)
  }

  onMessage(e) {
    console.log("receive" + e.data)
    const message = e.data.split(RecordSeparator)
    if (message[0] == "ReadResult") {
      const readResult = new ReadResult(JSON.parse(message[1]))
      this.readResulthandlers.forEach(handler => handler(readResult))
    }
  }

  sendSettingFile(settingFile) {
    this.sendMessage("SelectFile", settingFile)
  }
  sendReadRequest(readRequest) {
    this.sendMessage("ReadRequest", readRequest)
  }
  sendMessage(type, data) {
    this.socket.send(type + RecordSeparator + JSON.stringify(data))
  }
}

