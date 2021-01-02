package jp.co.teruuu.message

import spray.json.DefaultJsonProtocol

object MessageObject extends DefaultJsonProtocol {
  import spray.json._
  implicit val hbJsFmt = jsonFormat(HeartBeat, "count")
  implicit val sfJsFmt = jsonFormat(SelectFile, "id", "name", "isSftp", "host", "port",
    "user", "password", "filePath", "charCode", "tail")
  implicit val readReqJsFmt = jsonFormat(ReadRequest, "isBottom", "lineNum")
  implicit val readResJsFmt = jsonFormat(ReadResult, "isBottom", "lines")
  implicit val invJsFmt = jsonFormat0(InvalidMessage.apply)

  val RecordSeparator = 30.toChar

  def fromString(jsonStr: String):MessageObject = {
    jsonStr.split(RecordSeparator).toList match {
      case "HeartBeat" :: data :: Nil => data.parseJson.convertTo[HeartBeat]
      case "SelectFile" :: json :: Nil => json.parseJson.convertTo[SelectFile]
      case "ReadRequest" :: json :: Nil => json.parseJson.convertTo[ReadRequest]
      case "ReadResult" :: json :: Nil => json.parseJson.convertTo[ReadResult]
      case _ => InvalidMessage()
    }
  }

  def toMessage(message: MessageObject): String = {
    message match {
      case a:HeartBeat =>
        a.`type` + RecordSeparator + a.toJson
      case a:ReadRequest =>
        a.`type` + RecordSeparator + a.toJson
      case a:ReadResult =>
        a.`type` + RecordSeparator + a.toJson
      case a: InvalidMessage =>
        a.`type` + RecordSeparator + a.toJson
    }
  }
}

trait MessageObject {
  val `type`:String = ""
}

case class HeartBeat(var count: Int) extends MessageObject {self=>
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
                      user: String, password: String, filePath: String, charCode: String, tail: Boolean) extends MessageObject {self=>
  override val `type` = "SelectFile"
}

case class ReadRequest(isBottom: Boolean, lineNum: Int) extends MessageObject {
  override val `type` = "ReadRequest"
}

case class ReadResult(isBottom: Boolean, lines: List[String]) extends MessageObject {
  override val `type` = "ReadResult"
}