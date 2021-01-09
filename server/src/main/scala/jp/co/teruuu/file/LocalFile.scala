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

  override def close(): Unit = {
    println("localFile close start")
    reader.close()
    file.close()
    println("localFile close end")
  }

  override def readLines(lineNum: Int): List[String] = {
    def bufRead(buf: Array[Char], readSize: Int, readOffset: Int): Option[(String, Int)] = {
      val (nextBufOffset, readLength) = indexOfKaigyou(buf, readSize, readOffset)
      if(nextBufOffset >= 0) {
        bufReadOffset = nextBufOffset
        lineIndex += 1
        Some(buf.slice(readOffset, readLength).mkString, nextBufOffset)
      } else {
        None
      }
    }

    def bufReadLine(buf: Array[Char], readSize: Int, bufOffset: Int, lineNum: Int): List[String] = {
      if(lineNum == 0) {
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

    if(bufReadOffset != 0) {
      val bufTemp = new Array[Char](1024)
      for(i <- bufReadOffset until buf.length) {
        bufTemp(i-bufReadOffset) = buf(i)
      }
      buf = bufTemp
      bufReadOffset = buf.length - bufReadOffset
    }
    val readSize = reader.read(buf, bufReadOffset, buf.length - bufReadOffset)
    bufReadOffset = 0
    val a = bufReadLine(buf, buf.length, 0, lineNum) match {
      case a if a.nonEmpty & a.length < lineNum=> {
        a ::: readLines(lineNum - a.length)
      }
      case a => {
        a
      }
    }
    if(readSize == -1) {

      val b = buf.slice(bufReadOffset, buf.length).mkString.trim()
      buf = new Array[Char](1024)
      if(b.length > 0) {
        a ::: List(b)
      } else {
        a
      }
    } else {
      a
    }
  }

  private def indexOfKaigyou(buf: Array[Char], length: Int, offset: Int): (Int, Int) = {
    for (i <- offset until length) {
      if (buf(i) == 13) {
        if (i + 1 < length && buf(i + 1) == 10) {
          return (i + 2, i)
        } else {
          return (i + 1, i)
        }
      } else if (buf(i) == 10) {
        return (i + 1, i)
      }
    }
    (-1, -1)
  }
}
