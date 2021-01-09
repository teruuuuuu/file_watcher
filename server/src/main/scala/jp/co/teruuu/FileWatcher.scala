package jp.co.teruuu

import akka.actor.{Actor, ActorSystem, Props}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.ws.{BinaryMessage, Message, TextMessage}
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.stream.scaladsl.GraphDSL.Implicits._
import akka.stream.scaladsl.{Flow, GraphDSL, Keep, Sink, Source}
import akka.stream.{ActorMaterializer, FlowShape, OverflowStrategy}
import jp.co.teruuu.file.WatchReader
import jp.co.teruuu.message.{HeartBeat, MessageObject}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._
import scala.util.{Failure, Success}

object FileWatcher extends App {
  implicit val as = ActorSystem("FileWatcher")
  implicit val am = ActorMaterializer()

  Http()
    .bindAndHandle(Route.websocketRoute, "0.0.0.0", 8123)
    .onComplete {
      case Success(value) => println(s"Http bind Success: ${value}")
      case Failure(err) => println(s"Http bind Failure: ${err}")
    }
}

object Route {
  case object GetWebsocketFlow

  implicit val as = ActorSystem("FileWatcher")
  implicit val am = ActorMaterializer()

  val websocketRoute =
    pathEndOrSingleSlash {
      complete("WS server is alive\n")
    } ~ path("connect") {

      val handler = as.actorOf(Props[ClientHandlerActor])
      //      handler.?(GetWebsocketFlow)(3.seconds).mapTo[Flow[Message, Message, _]]
      val futureFlow = (handler ? GetWebsocketFlow) (3.seconds).mapTo[Flow[Message, Message, _]]

      onComplete(futureFlow) {
        case Success(flow) =>
          println("websocket onComplete")
          handleWebSocketMessages(flow)
        case Failure(err) => complete(err.toString)
      }

    }
}


class ClientHandlerActor extends Actor {
  import jp.co.teruuu.Route.GetWebsocketFlow
  implicit val as = context.system
  implicit val am = ActorMaterializer()

  val (down, publisher) = Source
    .actorRef[String](10000, OverflowStrategy.fail)
    .toMat(Sink.asPublisher(fanout = false))(Keep.both)
    .run()
  val watchReader = new WatchReader(down)


  // keepalive
  val counter = HeartBeat.apply(0)
  as.scheduler.schedule(0.seconds, 15.second, () => {
    down ! MessageObject.toMessage(counter.countUp())
  })

  override def receive = {
    case GetWebsocketFlow =>
      val flow = Flow.fromGraph(GraphDSL.create() { implicit b =>
        val textMsgFlow = b.add(Flow[Message]
          .mapAsync(4) {
            case tm: TextMessage => Future(tm.getStrictText)
            case bm: BinaryMessage =>
              // consume the stream
              bm.dataStream.runWith(Sink.ignore)
              Future.failed(new Exception("yuck"))
          })

        val pubSrc = b.add(Source.fromPublisher(publisher).map(TextMessage(_)))
        textMsgFlow ~> Sink.foreach[String](self ! _)
        FlowShape(textMsgFlow.in, pubSrc.out)
      })
      sender ! flow

    case s: String =>
      val message = MessageObject.fromString(s)
      println(s"client actor received $message")
      message match {
        case fileEvent if fileEvent.isFileEvent =>
          watchReader.addEvents(fileEvent)
        case _ => {}
      }
  }
}

