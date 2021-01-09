package jp.co.teruuu.file

import akka.actor.ActorRef
import jp.co.teruuu.message.{MessageObject, ReadRequest, ReadResult, SelectFile}

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
            case a if a.nonEmpty => down ! MessageObject.toMessage(ReadResult(isBottom = true, a))
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
      case a: ReadRequest =>
        down ! MessageObject.toMessage(ReadResult(isBottom = true, readBottom(a.lineNum)))
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

  def readBottom(lineNum: Int): List[String] = {
    watchFileOpt match {
      case Some(watchFile) =>
        watchFile.readLines(lineNum)
      case _ => List.empty[String]
    }
  }

  implicit def toWatchFile(selectFile: SelectFile):WatchFile = {
    selectFile.isSftp match {
      case false => new LocalFile(selectFile.filePath, selectFile.charCode)
      case true => new SftpFile(selectFile.host, selectFile.port, selectFile.user, selectFile.password, selectFile.filePath, selectFile.charCode)
    }
  }
}
