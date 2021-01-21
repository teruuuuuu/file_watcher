export class ReadRequest {
  constructor({ isBottom = true, lineNum = 50 }) {
    this.isBottom = isBottom;
    this.lineNum = lineNum;
  }
}
