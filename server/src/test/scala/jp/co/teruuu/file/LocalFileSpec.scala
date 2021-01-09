package jp.co.teruuu.file

import org.scalatest.{FlatSpec, Matchers}

class LocalFileSpec extends FlatSpec with Matchers {
  "The Hello object" should "say hello" in {
    val file = new LocalFile("C:\\Users\\arite\\OneDrive\\Desktop\\sample.txt", "UTF-8")
    println(file.readLines(15))
  }
}
