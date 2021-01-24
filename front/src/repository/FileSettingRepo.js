export class FileSettingRepo {
  constructor(dbService) {
    this.dbService = dbService;
    this.storeName = "fileSetting";
    this.dbService.addStore([this.storeName, { keyPath: "id" }]);
  }

  getAll(action) {
    this.dbService.getAll(this.storeName, action);
  }

  save(datas) {
    this.dbService.save(this.storeName, datas);
  }
  delete(datas) {
    this.dbService.delete(this.storeName, datas);
  }
}
