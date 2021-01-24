export class SearchSettingRepo {
  constructor(dbService) {
    this.dbService = dbService;
    this.storeName = "searchSetting";
    this.dbService.addStore([this.storeName, { keyPath: "id" }]);
  }

  get(id, action) {
    this.dbService.query(this.storeName, id, action);
  }

  save(data) {
    this.dbService.save(this.storeName, [data]);
  }
  delete(datas) {
    this.dbService.delete(this.storeName, datas);
  }
}
