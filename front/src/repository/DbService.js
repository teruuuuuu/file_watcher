export class DbService {
  constructor() {
    this.dbName = "myDb";
    this.dbVersion = 1;
    this.storeName = "myStore";
    this.initDbCon(this.dbName, this.dbVersion);
    this.initActions = [];
  }

  initDbCon(dbName, dbVersion) {
    const request = indexedDB.open(dbName, dbVersion);
    request.onerror = (event) => {
      console.log("Error init db");
      indexedDB.deleteDatabase(dbName);
    };
    request.onupgradeneeded = (event) => {
      this.dbCon = event.target.result;
      Array.from(this.dbCon.objectStoreNames).forEach((storeName) =>
        this.dbCon.deleteObjectStore(storeName)
      );
      this.dbCon.createObjectStore(this.storeName, { keyPath: "id" });
    };
    request.onsuccess = (event) => {
      this.dbCon = event.target.result;
      while (true) {
        if (this.initActions.length == 0) {
          break;
        } else {
          this.initActions.shift()();
        }
      }
    };
  }
  save(datas) {
    const transaction = this.dbCon.transaction([this.storeName], "readwrite");
    transaction.onerror = (e) => console.log("indexed db command error");
    var store = transaction.objectStore(this.storeName);
    datas.forEach((d) => store.put(d));
  }
  delete(datas) {
    const transaction = this.dbCon.transaction([this.storeName], "readwrite");
    transaction.onerror = (e) => console.log("indexed db command error");
    var store = transaction.objectStore(this.storeName);
    datas.forEach((d) => store.delete(d));
  }

  query(keys, action) {
    const transaction = this.dbCon.transaction([this.storeName], "readonly");
    transaction.onerror = (e) => console.log("indexed db querry error");
    var store = transaction.objectStore(this.storeName);
    keys.forEach((k) => {
      var req = store.get(k);
      req.onsuccess = action;
    });
  }

  getAll(action) {
    const f = ((action) => () => {
      const transaction = this.dbCon.transaction([this.storeName], "readonly");
      var objectStore = transaction.objectStore(this.storeName);
      objectStore.getAll().onsuccess = function (event) {
        const rows = event.target.result;
        action(rows);
      };
    })(action);
    if (this.dbCon) {
      f();
    } else {
      this.initActions.push(f);
    }
  }
}
