export class FileSetting {
  constructor({ id = -1, name = "", isSftp = false, host = "", port = 22,
    user = "", password = "", filePath = "", charCode = "", tail = false }) {
    this.id = id
    this.name = name
    this.isSftp = isSftp
    this.host = host
    this.port = port
    this.user = user
    this.password = password
    this.filePath = filePath
    this.charCode = charCode
    this.tail = tail
  }
}
