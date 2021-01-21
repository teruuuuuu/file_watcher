export class ReadResult {
  constructor({ isBottom = true, lines = [] }) {
    this.isBottom = isBottom;
    this.lines = lines;
  }
}
