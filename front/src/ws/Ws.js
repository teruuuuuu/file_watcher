import { ReadResult } from "../class/ReadResult";

const RecordSeparator = String.fromCharCode(30);

export class WS {
  constructor(url, hbInterval) {
    this.socket = new WebSocket(url);
    this.socket.addEventListener("message", (e) => this.onMessage(e));
    this.socket.addEventListener("close", (e) => {});
    this.counter = { count: 0 };
    setInterval(() => {
      this.sendMessage(
        "HeartBeat",
        Object.assign(this.counter, { count: this.counter.count + 1 })
      );
    }, hbInterval);
    this.handlers = [];
  }

  close() {
    this.socket.close();
  }

  addReadResultHandler(handler) {
    this.handlers.push(handler);
  }

  removeReadResultHandler(handler) {
    const index = this.handlers.findIndex((a) => a == handler);
    this.handlers =
      index >= 0
        ? this.handlers.slice(0, index).concat(this.handlers.slice(index + 1))
        : this.handlers;
  }

  onMessage(e) {
    // console.log("receive" + e.data);
    const message = e.data.split(RecordSeparator);
    if (message[0] == "ReadResult") {
      const readResult = new ReadResult(JSON.parse(message[1]));
      this.handlers.forEach((handler) => handler(readResult));
    }
  }

  sendSettingFile(settingFile) {
    this.sendMessage("SelectFile", settingFile);
  }
  sendReadRequest(readRequest) {
    this.sendMessage("ReadRequest", readRequest);
  }
  sendSearchRequest(searchSetting) {
    this.sendMessage("SearchSetting", searchSetting);
  }
  sendMessage(type, data) {
    try {
      if (this.socket.readyState && this.socket.OPEN) {
        this.socket.send(type + RecordSeparator + JSON.stringify(data));
      } else {
      }
    } catch (e) {
      console.info(e);
    }
  }
}
