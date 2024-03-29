package jp.co.teruuu.file

import java.nio.charset.Charset

import scala.io.Codec

class LocalFile(filePath: String, charCode: String) extends WatchFile {
  println("filepath:" + filePath + "init start")
  var file = scala.io.Source.fromFile(filePath)
  implicit val codec = Codec.charset2codec(Charset.forName(charCode))
  val reader = file.reader()
  println("filepath:" + filePath + "init end")

  var lineIndex = 0
  var buf = new Array[Char](1024)
  var bufReadOffset = 0

  override def getClone() = new LocalFile(filePath, charCode)

  override def close(): Unit = {
    println("localFile close start")
    reader.close()
    file.close()
    println("localFile close end")
  }

  override def readWithIndex(lineNum: Int): (Int, List[String]) =
    (lineIndex, readLines(lineNum))

  override def readLines(lineNum: Int): List[String] = {
    def bufRead(buf: Array[Char], readSize: Int, readOffset: Int): Option[(String, Int)] = {
      val (nextBufOffset, readLength, isNull) = indexOfKaigyou(buf, readSize, readOffset)
      if (nextBufOffset >= 0 && !(isNull && readLength == readOffset)) {
        // 改行があり、Null文字での空行以外
        bufReadOffset = nextBufOffset
        lineIndex += 1
        Some(buf.slice(readOffset, readLength).mkString, nextBufOffset)
      } else {
        None
      }
    }

    def bufReadLine(buf: Array[Char], readSize: Int, bufOffset: Int, lineNum: Int): List[String] = {
      if (lineNum == 0) {
        List.empty[String]
      } else {
        bufRead(buf, readSize, bufOffset) match {
          case Some((line, offset)) => {
            line :: bufReadLine(buf, readSize, offset, lineNum - 1)
          }
          case None => List.empty[String]
        }
      }
    }

    // バッファに対して既に読み込みがある場合、
    // 未読の部分を前に寄せて、後ろに新規読み込み分を追加する
    if (bufReadOffset != 0) {
      val bufTemp = new Array[Char](1024)
      for (i <- bufReadOffset until buf.length) {
        bufTemp(i - bufReadOffset) = buf(i)
      }
      buf = bufTemp
      bufReadOffset = buf.length - bufReadOffset
    }
    val readSize = reader.read(buf, bufReadOffset, buf.length - bufReadOffset)
    bufReadOffset = 0
    bufReadLine(buf, buf.length, 0, lineNum) match {
      case a if a.nonEmpty & a.length < lineNum => {
        a ::: readLines(lineNum - a.length)
      }
      case a => {
        a
      }
    }
//    if (readSize == -1) {
//      // TODO なおす
//      val b = buf.slice(bufReadOffset, buf.length).mkString.trim()
//      buf = new Array[Char](1024)
//      if (b.length > 0) {
//        a ::: List(b)
//      } else {
//        a
//      }
//    } else {
//      a
//    }
//    a
  }

  override def toBottom(): Unit = {
    // TODO
//    bufReadOffset = file.size
  }

  /**
   * buf内のoffsetからlengthの区間で改行の前後をタプルで返す。見つからなければ(-1,-1)を返す
   * @param buf
   * @param length
   * @param offset
   * @return (改行文字前インデックス, 改行文字後インデックス, NULL文字かどうか)
   */
  private def indexOfKaigyou(buf: Array[Char], length: Int, offset: Int): (Int, Int, Boolean) = {
    for (i <- offset until length) {
      if (buf(i) == 13) {
        if (i + 1 < length && buf(i + 1) == 10) {
          // CRLF
          return (i + 2, i, false)
        } else {
          // CR
          return (i + 1, i, false)
        }
      } else if (buf(i) == 10) {
        // LF
        return (i + 1, i, false)
      } else if (buf(i) == 0) {
        // NULL文字も改行として扱う(最終行での改行文字なし想定)
        return (i + 1, i, true)
      }
    }
    (-1, -1, false)
  }

}
