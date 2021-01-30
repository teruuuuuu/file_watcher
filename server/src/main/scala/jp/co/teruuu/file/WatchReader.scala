package jp.co.teruuu.file

import akka.actor.ActorRef
import jp.co.teruuu.message.{MessageObject, ReadRequest, ReadResult, SearchSetting, SelectFile}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class WatchReader(down: ActorRef) {
  var watchFileOpt = Option.empty[WatchFile]
  var tailOn = false
  var events = List.empty[MessageObject]

  Future {
    while (true) {
      try {
        if (tailOn && watchFileOpt.isDefined) {
          readBottom(50) match {
            case a if a._2.nonEmpty => down ! MessageObject.toMessage(ReadResult(a._1, a._2))
            case _ =>
          }
        }
        events match {
          case event :: tail => {
            doEvent(event)
            events = tail
          }
          case _ => {}
        }
      } catch {
        case e: Exception => {
          println(e)
        }
      }
      Thread.sleep(100)
    }
  }

  def addEvents(message: MessageObject): Unit = {
    events = events ::: List(message)
  }

  def doEvent(fileEvent: MessageObject): Unit = {
    fileEvent match {
      case a: SelectFile =>
        selectFile(a)
      case a: ReadRequest => readBottom(a.lineNum)  match { case (fromLine, list) =>
        down ! MessageObject.toMessage(ReadResult(fromLine, list))
      }
      case a: SearchSetting =>
        println(a)
      case _ => {}
    }
  }

  def selectFile(selectFile: SelectFile)(implicit toWatchFile: SelectFile => WatchFile): Unit = {
    watchFileOpt match {
      case Some(watchFile) => watchFile.close()
      case _ => {}
    }
    if (selectFile.id == -1) {
      watchFileOpt = None
    } else {
      watchFileOpt = Some(selectFile)
      tailOn = selectFile.tail
    }
  }

  def readBottom(lineNum: Int): (Int, List[String]) = {
    watchFileOpt match {
      case Some(watchFile) =>
        watchFile.readWithIndex(lineNum)
      case _ => (0, List.empty[String])
    }
  }

  implicit def toWatchFile(selectFile: SelectFile):WatchFile = {
    selectFile.isSftp match {
      case false => new LocalFile(selectFile.filePath, selectFile.charCode)
      case true => new SftpFile(selectFile.host, selectFile.port, selectFile.user, selectFile.password, selectFile.filePath, selectFile.charCode)
    }
  }
}
