package jp.co.teruuu.file

import jp.co.teruuu.message.SelectFile
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class WatchReader(tailCallback: List[String] => Unit) {
  var watchFileOpt = Option.empty[WatchFile]
  var tailOn = false

  def selectFile(selectFile: SelectFile): Unit = {
    watchFileOpt match {
      case Some(watchFile) => watchFile.close()
      case _ => {}
    }
    if (selectFile.id == -1) {
      watchFileOpt = None
    } else {
      watchFileOpt = selectFile.isSftp match {
        case false => Some(new LocalFile(selectFile.filePath, selectFile.charCode))
        case true => Some(new SftpFile(selectFile.host, selectFile.port, selectFile.user, selectFile.password, selectFile.filePath, selectFile.charCode))
      }
      tailOn = selectFile.tail
    }

    Future {
      while (true) {
        if(tailOn && watchFileOpt.isDefined) {
          readBottom(50) match {
            case a if a.nonEmpty => tailCallback(a)
            case _ =>
          }
        }
        Thread.sleep(100)
      }
    }
  }

  def readBottom(lineNum: Int): List[String] = {
    watchFileOpt match {
      case Some(watchFile) => watchFile.readLines(lineNum)
      case _ => List.empty[String]
    }
  }

  def tail(): Unit = {

  }

}
