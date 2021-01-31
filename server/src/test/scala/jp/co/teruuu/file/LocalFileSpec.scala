package jp.co.teruuu.file

import org.scalatest.{FlatSpec, Matchers}

class LocalFileSpec extends FlatSpec with Matchers {
  "LocalFile" should "read by index" in {
    val file = new LocalFile("C:\\Users\\arite\\OneDrive\\Desktop\\range2.txt", "UTF-8")
    println(file.readWithIndex(50))
    println(file.readWithIndex(50))
    println(file.readWithIndex(50))

//    val file = new LocalFile(getClass.getResource("/sample.txt").getPath, "UTF-8")
//    println(file.readWithIndex(3))
//    println(file.readWithIndex(3))
  }

//  "The Hello object" should "say hello" in {
//    val file = new LocalFile("C:\\Users\\arite\\OneDrive\\Desktop\\sample.txt", "UTF-8")
//    println(file.readLines(15))
//  }
}
