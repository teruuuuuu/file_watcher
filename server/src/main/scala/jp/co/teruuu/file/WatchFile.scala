package jp.co.teruuu.file

trait WatchFile {
  def close(): Unit
  def readLines(length: Int): List[String]
}
