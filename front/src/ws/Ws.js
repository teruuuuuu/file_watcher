import { ReadResult } from "../class/ReadResult";
import { SearchResult } from "../class/SearchResult";

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
    this.readResulthandlers = [];
    this.searchResulthandlers = [];
  }

  close() {
    this.socket.close();
  }

  addReadResultHandler(handler) {
    this.readResulthandlers.push(handler);
  }

  removeReadResultHandler(handler) {
    const index = this.readResulthandlers.findIndex((a) => a == handler);
    this.readResulthandlers =
      index >= 0
        ? this.readResulthandlers
            .slice(0, index)
            .concat(this.readResulthandlers.slice(index + 1))
        : this.readResulthandlers;
  }

  addSearchResultHandler(handler) {
    this.searchResulthandlers.push(handler);
  }

  removeSearchResultHandler(handler) {
    const index = this.searchResulthandlers.findIndex((a) => a == handler);
    this.searchResulthandlers =
      index >= 0
        ? this.searchResulthandlers
            .slice(0, index)
            .concat(this.searchResulthandlers.slice(index + 1))
        : this.searchResulthandlers;
  }

  onMessage(e) {
    // console.log("receive" + e.data);
    const message = e.data.split(RecordSeparator);
    if (message[0] == "ReadResult") {
      const readResult = new ReadResult(JSON.parse(message[1]));
      this.readResulthandlers.forEach((handler) => handler(readResult));
    } else if (message[0] == "SearchResult") {
      const searchResult = new SearchResult(JSON.parse(message[1]));
      this.searchResulthandlers.forEach((handler) => handler(searchResult));
    }
  }

  sendSettingFile(settingFile) {
    this.sendMessage("SelectFile", settingFile);
  }
  sendReadRequest(readRequest) {
    this.sendMessage("ReadRequest", readRequest);
  }
  sendSearchRequest(searchSetting) {
    this.sendMessage("SearchRequest", searchSetting);
  }
  sendMessage(type, data) {
    console.info(data);
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
