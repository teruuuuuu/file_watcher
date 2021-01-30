export class FileCacheRepo {
  constructor(dbService) {
    this.dbService = dbService;
    this.storeName = "fileCache";
    this.dbService.addStore([this.storeName, { keyPath: "index" }]);
  }

  get(index, action) {
    this.dbService.query(this.storeName, index, action);
  }

  save(data) {
    this.dbService.save(this.storeName, [data]);
  }
  delete(datas) {
    this.dbService.delete(this.storeName, datas);
  }
  clear() {
    this.dbService.clear(this.storeName);
  }
}
