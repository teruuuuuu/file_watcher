package jp.co.teruuu.file

trait WatchFile {
  def close(): Unit

  def getClone(): WatchFile

  /**
   * 読み込み開始行と読み込んだ内容を返す
   * @param lineNum
   * @return
   */
  def readWithIndex(lineNum: Int): (Int, List[String])

  /**
   * lineNum行分読み込んだ内容を返す
   * @param lineNum
   * @return
   */
  def readLines(lineNum: Int): List[String]


  /**
   * ストリームの読み込み位置を末尾にセット
   */
  def toBottom(): Unit
}
