

export class KeyPressHandler {
  constructor(document) {
    this.handlers = []
    document.addEventListener('keydown', (e) => this.handle(e))
  }

  addHandler(handler) {
    this.handlers = this.handlers.concat(handler)
  }
  removeHandler(handler) {
    const index = this.handlers.findIndex(a => a == handler)
    this.handlers = index >= 0 ? this.handlers.slice(0, index).concat(this.handlers.slice(index + 1)) : this.handlers
  }

  handle(e) {
    this.handlers.forEach(handler => handler(e))
  }
}
