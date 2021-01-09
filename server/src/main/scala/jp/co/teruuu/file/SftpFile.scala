package jp.co.teruuu.file

import net.schmizz.sshj.SSHClient
import net.schmizz.sshj.sftp.RemoteFile
import net.schmizz.sshj.transport.verification.PromiscuousVerifier

class SftpFile(host: String, port: Int, user: String, password: String, filePath: String, charCode: String) extends WatchFile {
  val fileSeparator = "/"
  lazy val sshClient = sshConnectSetting(host, port, user, password)
  lazy val sftpClient = sshClient.newSFTPClient()
  lazy val file: RemoteFile = sftpClient.open(filePath)
  var fileNameOpt = Option.empty[String]

  var readIndex = 0
  var lineIndex = 0
  val buf = new Array[Byte](1024)

  override def readLines(length: Int): List[String] = {
    if(length > 0) {
      readOneLine() match {
        case Some(s) => s :: readLines(length - 1)
        case _ => List.empty[String]
      }
    } else {
      List.empty[String]
    }
  }

  def readOneLine(): Option[String] = {
    val readSize = file.read(readIndex, buf, 0, buf.length)
    indexOfKaigyou(buf, readSize) match {
      case (a,b) if a >= 0 =>
        readIndex += a
        lineIndex += 1
        Some(new String(buf.slice(0,b), charCode))
      case _ =>
        if(readSize > 0) {
          readIndex += readSize
          Some(new String(buf.slice(0,readSize), charCode))
        } else {
          None
        }
    }
  }

  private def indexOfKaigyou(buf: Array[Byte], length: Int): (Int, Int) = {
    for (i <- 0 to length) {
      if (buf(i) == 13) {
        if (i + 1 < length && buf(i + 1) == 10) {
          return (i + 2, i)
        } else {
          return (i + 1, i)
        }
      } else if (buf(i) == 10) {
        return (i + 1, i)
      }
    }
    (-1, -1)
  }

  private def sshConnectSetting(host: String, port: Int, username: String, password: String) = {
    val ssh = new SSHClient
    ssh.addHostKeyVerifier(new PromiscuousVerifier)
    ssh.loadKnownHosts()
    ssh.connect(host, port)
    // keepAliveの感覚設定
    ssh.getConnection.getKeepAlive.setKeepAliveInterval(30)
    // 接続時のsshキーの指定はauthPublickeyを認証時のパスワードにはauthPasswordを使う
    // ssh.authPublickey(keyPath);
    ssh.authPassword(username, password)
    ssh
  }

  override def close(): Unit = {
    file.close()
    sftpClient.close()
    sshClient.close()
  }
}