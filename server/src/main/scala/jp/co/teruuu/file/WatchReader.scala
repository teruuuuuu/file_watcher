package jp.co.teruuu.file

import akka.actor.ActorRef
import jp.co.teruuu.message._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.control.Breaks

class WatchReader(down: ActorRef) {
  var watchFileOpt = Option.empty[WatchFile]
  var tailOn = false
  var events = List.empty[MessageObject]
  var search = List.empty[String]

  Future {
    while (true) {
      try {
        if (tailOn && watchFileOpt.isDefined) {
          readBottom(50) match {
            case a if a._2.nonEmpty => {
              down ! MessageObject.toMessage(ReadResult(a._1, a._2))

              a._2.filter(c => search.exists(d => c.matches(d))) match {
                case l if l.nonEmpty => down ! MessageObject.toMessage(SearchResult(a._1, l))
                case _ => {}
              }
            }
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
      case a: SelectFile => {
        search = List.empty[String]
        selectFile(a)
      }
      case a: ReadRequest => readBottom(a.lineNum)  match { case (fromLine, list) =>
        down ! MessageObject.toMessage(ReadResult(fromLine, list))
      }
      case a: SearchRequest =>
        search = a.searchSettingValues
        if(!a.tail) {
          watchFileOpt match {
            case Some(file) =>
              val f = file.getClone()
              var result = List.empty[String]
              var loop = true
              while(loop) {
                val k = f.readLines(50)
                if(k.isEmpty) {
                  loop = false
                } else {
                  result = result ::: k.filter(a => search.exists(b => a.matches(b)))
                }
              }
              down ! MessageObject.toMessage(SearchResult(a.id, result))
            case _ => {}
          }
        }
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
      if(tailOn) {
        watchFileOpt.get.toBottom()
      }
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
