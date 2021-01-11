export class DbService {
  constructor() {
    this.dbName = "myDb"
    this.dbVersion = 1
    this.storeName = "myStore"
    this.initDbCon(this.dbName, this.dbVersion)
  }

  initDbCon(dbName, dbVersion) {
    const request = indexedDB.open(dbName)
    request.onerror = (event) => {
      console.log("Error init db")
    }
    request.onupgradeneeded = (event) => {
      this.dbCon = event.target.result
      this.dbCon.createObjectStore(this.storeName, { keyPath: "id" })
    }
    request.onsuccess = (event) => {
      this.dbCon = event.target.result
    }
  }
  save(datas) {
    const transaction = this.dbCon.transaction([this.storeName], "readwrite")
    transaction.onerror = (e) => console.log("indexed db command error")
    var store = transaction.objectStore(this.storeName)
    datas.forEach(d => store.put(d))
  }
  delete(datas) {
    const transaction = this.dbCon.transaction([this.storeName], "readwrite")
    transaction.onerror = (e) => console.log("indexed db command error")
    var store = transaction.objectStore(this.storeName)
    datas.forEach(d => store.delete(d))
  }

  query(keys, action) {
    const transaction = this.dbCon.transaction([this.storeName], "readonly")
    transaction.onerror = (e) => console.log("indexed db querry error")
    var store = transaction.objectStore(this.storeName)
    keys.forEach(k => {
      var req = store.get(k)
      req.onsuccess = action
    })
  }

  getAll(action) {
    const cursorAction = ((action) => () => {
      const transaction = this.dbCon.transaction([this.storeName], "readonly")
      var objectStore = transaction.objectStore(this.storeName)
      objectStore.getAll().onsuccess = function (event) {
        const rows = event.target.result
        action(rows)
      }
    })(action)
    if (this.dbCon) {
      cursorAction()
    } else {
      setTimeout(() => cursorAction(), 100)
    }

  }

  clear() {
    this.dbCon.close()
    const req = indexedDB.deleteDatabase(this.dbName)
    req.onerror = function (event) {
      console.log("Error deleting database.")
      initFunc(this.dbName, this.dbVersion)
    }
    req.onsuccess = function (event) {
      console.log("Database deleted successfully")
      initFunc(this.dbName, this.dbVersion)
    }
  }
}
