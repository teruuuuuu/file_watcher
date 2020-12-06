package jp.co.teruuu

import jp.co.teruuu.bnf.BnfObject.BnfParser
import jp.co.teruuu.scomb.Result

import scala.scalajs.js.annotation.{JSExport, JSExportTopLevel}

//trait PostMessageDto {
//  def toSjObject(): scalajs.js.Object
//}
//
//object PostMessageDto {
//
//  def apply(message: scalajs.js.Object):PostMessageDto = apply(sjsObjectToMap(message))
//
//  def apply(messageMap: Map[String, scalajs.js.Object]):PostMessageDto = {
//    messageMap.getOrElse("to", "_") match {
//      case "scala" =>
//        messageMap.getOrElse("command", "undef") match {
//          case "parse" =>
//            println("parse!")
//            val k = messageMap.get("data").fold(ParseCommandObject(List.empty, List.empty))( data => {
//              ParseCommandObject(sjsObjectToMap(data).get("input") match {
//                case Some(input) =>
//                  println(input)
//                  input.asInstanceOf[scalajs.js.Array[String]].toList
//                case _ => List()
//              },
//                sjsObjectToMap(data).get("bnf") match {
//                  case Some(bnf) =>
//                    println(bnf)
//                    bnf.asInstanceOf[scalajs.js.Array[String]].toList
//                  case _ => List()
//                })
//            })
//            println(k)
//            k
//          case "undef" => UndefCommand
//        }
//      case "_" => UndefCommand
//    }
//  }
//
//  private def sjsObjectToMap(sjObject: scalajs.js.Object):Map[String, scalajs.js.Object] =
//    scalajs.js.Object.entries(sjObject).toList.foldLeft(Map.empty[String, scalajs.js.Object])((acc, cur) => {
//      acc + (cur._1 -> cur._2.asInstanceOf[scalajs.js.Object])
//  })
//}
//
////{ "command": "parse", "data": {"input": Array, "bnf": Array}}
//case class ParseCommandObject(input: List[String], bnf: List[String]) extends PostMessageDto {
//  def toSjObject(): scalajs.js.Object = {
//    scalajs.js.Object.apply(scalajs.js.Dictionary(("to"->"js")))
//  }
//}
//
//object UndefCommand extends PostMessageDto {
//  def toSjObject(): scalajs.js.Object = {
//    scalajs.js.Object.apply(scalajs.js.Dictionary(("to"->"js")))
//  }
//}

@JSExportTopLevel("ScalaJsApp")
object ScalaJsApp {

  def main(args: Array[String]): Unit = {
//    window.addEventListener("message", { (e0: dom.Event) =>
//      PostMessageDto.apply(e0.asInstanceOf[dom.MessageEvent].data.asInstanceOf[scalajs.js.Object]) match {
//        case x: ParseCommandObject =>
//          window.postMessage(parse(x).mkString(9.toChar.toString), null)
//        case _ =>
//          println("un")
//      }
//    }, false)
  }

  @JSExport
  def parse(bnf: scalajs.js.Array[String], input: scalajs.js.Array[String]): scalajs.js.Array[String] = {
    BnfParser.apply(bnf.toList)._2 match {
      case Some(parser) =>
        input.filter(parser.parse(_).isInstanceOf[Result.Success[_]])
      case _ => scalajs.js.Array()
    }
  }

//  def parse(data: ParseCommandObject): List[String] = {
//    BnfParser.apply(data.bnf)._2 match {
//      case Some(parser) =>
//        data.input.filter(parser.parse(_).isInstanceOf[Result.Success[_]])
//      case _ => List()
//    }
//  }

//  def appendPar(targetNode: dom.Node, text: String): Unit = {
//    val parNode = document.createElement("p")
//    parNode.textContent = text
//    targetNode.appendChild(parNode)
//  }
//
//  @JSExportTopLevel("addClickedMessage")
//  def addClickedMessage(): Unit = {
//    appendPar(document.body, "You clicked the button!")
//  }
//
//  def parse: String = {
//    val bnf_definition = List("<number> ::= (\"0\"|\"1\"|\"2\"|\"3\"|\"4\"|\"5\"|\"6\"|\"7\"|\"8\"|\"9\")",
//      "<lower> ::= (\"a\"|\"b\"|\"c\"|\"d\"|\"e\"|\"f\"|\"g\"|\"h\"|\"i\"|\"j\"|\"k\"|\"l\"|\"m\"|\"n\"|\"o\"|\"p\"|\"q\"|\"r\"|\"s\"|\"t\"|\"u\"|\"v\"|\"w\"|\"x\"|\"y\"|\"z\")",
//      "<upper> ::= (\"A\"|\"B\"|\"C\"|\"D\"|\"E\"|\"F\"|\"G\"|\"H\"|\"I\"|\"J\"|\"K\"|\"L\"|\"M\"|\"N\"|\"O\"|\"P\"|\"Q\"|\"R\"|\"S\"|\"T\"|\"U\"|\"V\"|\"W\"|\"X\"|\"Y\"|\"Z\")",
//      "<comma> ::= \".\"",
//      "<char> ::= (<number>|<lower>|<upper>|<comma>)",
//      "<host> ::= <char> +",
//      "<dir> ::= (<char>|\"/\") +",
//      "<key> ::= (<lower>|<upper>)+",
//      "<value> ::= (<lower>|<upper>|<number>)+",
//      "<param> ::= <key> \"=\" <value>",
//      "<params> ::= <param> (\"&\"<param>)*",
//      "<scheme> ::= \"https\"|\"http\"",
//      "<uri> ::= <scheme> \"://\" <host> [\"/\" <dir> [\"?\" <params>]]",
//      "<root> ::= <uri>"
//    )
//
//    val inputs = List("https://host/a/b/c?d=e&g=h")
//    val json_keys = List("scheme: scheme", "host: host", "dir: dir", "key: key", "value: value")
//    Converter.jsonConvert(bnf_definition, inputs, json_keys).foldLeft("")((acc, cur) => acc + cur._2)
//  }
//

//  @JSExport
//  def bnfParse(textsJs: String,
//               bnfsJs: String): String = {
//
//    val texts = textsJs.split("!!!").toList
//    val bnfs = bnfsJs.split("!!!").toList
//
//    println(texts)
//    println(bnfs)
//
//    BnfParser.apply(bnfs)._2 match {
//      case Some(parser) => {
//        texts.foreach(text => {
//          println(text)
//          println(text.getBytes.toList)
//          println(text.length)
//          println(parser.parse(text))
//        })
//        val k = texts.filter(text =>
//          parser.parse(text).isInstanceOf[Result.Success[_]])
//        println(k)
//        k.mkString("!!!")
//      }
//
//      case _ => ""
//    }
//  }
}
