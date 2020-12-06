package jp.co.teruuu

import jp.co.teruuu.bnf.BnfObject.BnfParser
import jp.co.teruuu.bnf.Converter
import jp.co.teruuu.scomb.Result
import org.scalajs.dom
import org.scalajs.dom.document

import scala.scalajs.js
import scala.scalajs.js.annotation.{JSExport, JSExportTopLevel}


object ScalaJsApp {

  def main(args: Array[String]): Unit = {

//    println("greeting!")
//    appendPar(document.body, "Hello World")
//    appendPar(document.body, parse)
  }


  def appendPar(targetNode: dom.Node, text: String): Unit = {
    val parNode = document.createElement("p")
    parNode.textContent = text
    targetNode.appendChild(parNode)
  }

  @JSExportTopLevel("addClickedMessage")
  def addClickedMessage(): Unit = {
    appendPar(document.body, "You clicked the button!")
  }

  def parse: String = {
    val bnf_definition = List("<number> ::= (\"0\"|\"1\"|\"2\"|\"3\"|\"4\"|\"5\"|\"6\"|\"7\"|\"8\"|\"9\")",
      "<lower> ::= (\"a\"|\"b\"|\"c\"|\"d\"|\"e\"|\"f\"|\"g\"|\"h\"|\"i\"|\"j\"|\"k\"|\"l\"|\"m\"|\"n\"|\"o\"|\"p\"|\"q\"|\"r\"|\"s\"|\"t\"|\"u\"|\"v\"|\"w\"|\"x\"|\"y\"|\"z\")",
      "<upper> ::= (\"A\"|\"B\"|\"C\"|\"D\"|\"E\"|\"F\"|\"G\"|\"H\"|\"I\"|\"J\"|\"K\"|\"L\"|\"M\"|\"N\"|\"O\"|\"P\"|\"Q\"|\"R\"|\"S\"|\"T\"|\"U\"|\"V\"|\"W\"|\"X\"|\"Y\"|\"Z\")",
      "<comma> ::= \".\"",
      "<char> ::= (<number>|<lower>|<upper>|<comma>)",
      "<host> ::= <char> +",
      "<dir> ::= (<char>|\"/\") +",
      "<key> ::= (<lower>|<upper>)+",
      "<value> ::= (<lower>|<upper>|<number>)+",
      "<param> ::= <key> \"=\" <value>",
      "<params> ::= <param> (\"&\"<param>)*",
      "<scheme> ::= \"https\"|\"http\"",
      "<uri> ::= <scheme> \"://\" <host> [\"/\" <dir> [\"?\" <params>]]",
      "<root> ::= <uri>"
    )

    val inputs = List("https://host/a/b/c?d=e&g=h")
    val json_keys = List("scheme: scheme", "host: host", "dir: dir", "key: key", "value: value")
    Converter.jsonConvert(bnf_definition, inputs, json_keys).foldLeft("")((acc, cur) => acc + cur._2)
  }

  @JSExportTopLevel("bnfParse")
  def bnfParse(textsJs: Any, bnfsJs: Any): List[String] = {
    println(textsJs)
    println(bnfsJs)
    val texts = textsJs.asInstanceOf[List[String]]
    val bnfs = bnfsJs.asInstanceOf[List[String]]

    BnfParser.apply(bnfs)._2 match {
      case Some(parser) => {
        texts.filter(text => parser.parse(text).isInstanceOf[Result.Success[_]])
      }
      case _ => List()
    }
  }
}
