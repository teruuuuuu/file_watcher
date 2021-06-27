package jp.co.teruuu

import java.nio.charset.StandardCharsets

import net.schmizz.sshj.SSHClient
import net.schmizz.sshj.common.{LoggerFactory, StreamCopier}
import net.schmizz.sshj.transport.verification.PromiscuousVerifier

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

object TrySshj extends App {
  private def sshConnectSetting(host: String, port: Int, username: String, password: String) = {
    val ssh = new SSHClient
    ssh.addHostKeyVerifier(new PromiscuousVerifier)
    ssh.loadKnownHosts()
    ssh.connect(host, port)
    ssh.getConnection.getKeepAlive.setKeepAliveInterval(30)
    ssh.authPassword(username, password)
    ssh
  }

  val con = sshConnectSetting("localhost", 22, "arimura", "arimura")
  val session = con.startSession()
  session.allocateDefaultPTY()
  val shell = session.startShell()

//  new StreamCopier(shell.getInputStream(), System.out, LoggerFactory.DEFAULT)
//    .bufSize(shell.getLocalMaxPacketSize())
//    .spawn("stdout")
//
//  new StreamCopier(shell.getErrorStream(), System.err, LoggerFactory.DEFAULT)
//    .bufSize(shell.getLocalMaxPacketSize())
//    .spawn("stderr")
//
//  new StreamCopier(System.in, shell.getOutputStream(), LoggerFactory.DEFAULT)
//    .bufSize(shell.getRemoteMaxPacketSize())
//    .copy()

  val outputStream = shell.getOutputStream()
  val inputStream = shell.getInputStream

  Future {
    val buf = new Array[Byte](1024)
    while (true) {
      val readSize = inputStream.read(buf)
      if (readSize > 0) {
        print(new String(buf.slice(0, readSize),
          StandardCharsets.UTF_8))
      }
      Thread.sleep(10)
    }
  }

  while (true) {
    outputStream.write((scala.io.StdIn.readLine() + "\n").getBytes())
    outputStream.flush()
  }
}