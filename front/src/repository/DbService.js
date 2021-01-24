export class DbService {
  constructor() {
    this.dbName = "myDb";
    this.dbVersion = 1;
    // this.storeName = "myStore";
    // this.initDbCon(this.dbName, this.dbVersion);
    this.callbackActions = [];
    this.stores = [];
  }

  addStore(store) {
    this.stores.push(store);
  }

  init() {
    const request = indexedDB.open(this.dbName, this.dbVersion);
    request.onerror = (event) => {
      console.log("Error init db");
      indexedDB.deleteDatabase(this.dbName);
    };
    request.onupgradeneeded = (event) => {
      this.dbCon = event.target.result;
      Array.from(this.dbCon.objectStoreNames).forEach((storeName) =>
        this.dbCon.deleteObjectStore(storeName)
      );
      this.stores.forEach((store) => {
        this.dbCon.createObjectStore(store[0], store[1]);
      });
    };
    request.onsuccess = (event) => {
      this.dbCon = event.target.result;
      while (true) {
        if (this.callbackActions.length == 0) {
          break;
        } else {
          this.callbackActions.shift()();
        }
      }
    };
  }
  save(storName, datas) {
    const transaction = this.dbCon.transaction([storName], "readwrite");
    transaction.onerror = (e) => console.log("indexed db command error");
    var store = transaction.objectStore(storName);
    datas.forEach((d) => store.put(d));
  }
  delete(storName, datas) {
    const transaction = this.dbCon.transaction([storName], "readwrite");
    transaction.onerror = (e) => console.log("indexed db command error");
    var store = transaction.objectStore(storName);
    datas.forEach((d) => store.delete(d));
  }

  query(storName, key, action) {
    const transaction = this.dbCon.transaction([storName], "readonly");
    transaction.onerror = (e) => console.log("indexed db querry error");
    var store = transaction.objectStore(storName);
    store.get(key).onsuccess = function (event) {
      const data = event.target.result;
      action(data);
    };
  }

  getAll(storName, action) {
    const f = ((action) => () => {
      const transaction = this.dbCon.transaction([storName], "readonly");
      var objectStore = transaction.objectStore(storName);
      objectStore.getAll().onsuccess = function (event) {
        const rows = event.target.result;
        action(rows);
      };
    })(action);
    if (this.dbCon) {
      f();
    } else {
      this.callbackActions.push(f);
    }
  }
}
