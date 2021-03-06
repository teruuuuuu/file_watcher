package jp.co.teruuu.message

import spray.json.DefaultJsonProtocol

object MessageObject extends DefaultJsonProtocol {

  import spray.json._

  implicit val hbJsFmt = jsonFormat(HeartBeat, "count")
  implicit val sfJsFmt = jsonFormat(SelectFile, "id", "name", "isSftp", "host", "port",
    "user", "password", "filePath", "charCode", "tail")
  implicit val readReqJsFmt = jsonFormat(ReadRequest, "isBottom", "lineNum")
  implicit val readResJsFmt = jsonFormat(ReadResult, "index", "lines")
  implicit val searchRequestFmt = jsonFormat(SearchRequest, "id", "searchSelect", "searchSettingValues", "tail")
  implicit val searchResultFmt = jsonFormat(SearchResult, "id", "searchResult")
  implicit val invJsFmt = jsonFormat0(InvalidMessage.apply)

  val RecordSeparator = 30.toChar

  def fromString(jsonStr: String): MessageObject = {
    jsonStr.split(RecordSeparator).toList match {
      case "HeartBeat" :: json :: Nil => json.parseJson.convertTo[HeartBeat]
      case "SelectFile" :: json :: Nil => json.parseJson.convertTo[SelectFile]
      case "ReadRequest" :: json :: Nil => json.parseJson.convertTo[ReadRequest]
      case "SearchRequest" :: json :: Nil => json.parseJson.convertTo[SearchRequest]
      case "ReadResult" :: json :: Nil => json.parseJson.convertTo[ReadResult]
//      case "SearchRequest" :: json :: Nil => json.parseJson.convertTo[SearchRequest]
      case _ => InvalidMessage()
    }
  }

  def toMessage(message: MessageObject): String = {
    message match {
      case a: HeartBeat =>
        a.`type` + RecordSeparator + a.toJson
      case a: ReadRequest =>
        a.`type` + RecordSeparator + a.toJson
      case a: ReadResult =>
        a.`type` + RecordSeparator + a.toJson
      case a: SearchResult =>
        a.`type` + RecordSeparator + a.toJson
      case a: InvalidMessage =>
        a.`type` + RecordSeparator + a.toJson
    }
  }
}

trait MessageObject {
  val `type`: String = ""

  def isFileEvent = false
}

case class HeartBeat(var count: Int) extends MessageObject {
  self =>
  override val `type` = "HeartBeat"

  def countUp() = change(1)

  def countDown() = change(-1)

  def change(i: Int) = {
    count += i
    self
  }
}

case class InvalidMessage() extends MessageObject {
  override val `type` = "InvalidMessage"
}

case class SelectFile(id: Int, name: String, isSftp: Boolean, host: String, port: Int,
                      user: String, password: String, filePath: String, charCode: String, tail: Boolean) extends MessageObject {
  self =>
  override val `type` = "SelectFile"

  override def isFileEvent = true
}

case class ReadRequest(isBottom: Boolean, lineNum: Int) extends MessageObject {
  override val `type` = "ReadRequest"

  override def isFileEvent = true
}

case class ReadResult(index: Int, lines: List[String]) extends MessageObject {
  override val `type` = "ReadResult"
}

//case class SearchSetting(id: Int, searchSelect: String, searchSettingValues: List[String]) extends MessageObject {
//  override val `type` = "SearchSetting"
//  override def isFileEvent = true
//}

case class SearchRequest(id: Int, searchSelect: String, searchSettingValues: List[String], tail: Boolean) extends MessageObject {
  override val `type` = "SearchRequest"
  override def isFileEvent = true
}

case class SearchResult(id: Int, searchResult: List[String]) extends MessageObject {
  override val `type` = "SearchResult"
}