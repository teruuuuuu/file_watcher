package jp.co.teruuu.file

import org.scalatest.{FlatSpec, Matchers}

class SftpFileSpec extends FlatSpec with Matchers {
  "The Hello object" should "say hello" in {
    val file = new SftpFile("127.0.0.1", 22, "arimura", "arimura", "/home/arimura/sample.txt", "UTF-8")
    println(file.readLines(15))
  }
}
