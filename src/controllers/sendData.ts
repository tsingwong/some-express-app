/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-19 19:20:45
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-02-07 14:12:02
 */
import { Request, Response } from "express"
import { EventEmitter } from "events"

interface SendDataType {
  msg: string
  st: string
}
export const EVENT = new EventEmitter()
export const MSG_POST = Symbol("msg_post")
const MSG_TO_SEND: Array<SendDataType> = []

export const index = (req: Request, res: Response) => {
  res.render("sendData")
}

export const postPage = (req: Request, res: Response) => {
  res.render("post", {})
}

export const postApi = (req: Request, res: Response) => {
  let data: SendDataType = {
    msg: req.body.msg,
    st: new Date().toLocaleTimeString(),
  }

  EVENT.emit(MSG_POST, data)
  MSG_TO_SEND.push(data)

  console.log(EVENT.listenerCount(MSG_POST))
  console.log(EVENT.listeners(MSG_POST))
  console.log(MSG_TO_SEND)

  res.redirect("/post")
}

export const pollingPage = (req: Request, res: Response) => {
  res.render("polling", {
    title: "polling",
  })
}
export const pollingApi = (req: Request, res: Response) => {
  res.send(MSG_TO_SEND.splice(0))
}

export const longPollingPage = (req: Request, res: Response) => {
  res.render("longPolling", {
    title: "longPolling",
  })
}

export const longPollingApi = (req: Request, res: Response) => {
  const longPollingSend = (data: any) => {
    res.send(data)
  }
  res.setHeader("Connection", "keep-alive")
  EVENT.once(MSG_POST, longPollingSend)
  req.socket.on("close", () => {
    console.log("long polling socket close")
    EVENT.removeListener(MSG_POST, longPollingSend)
  })
}

export const iframePage = (req: Request, res: Response) => {
  res.render("iframe", {
    title: "iframe",
  })
}

export const iframeApi = (req: Request, res: Response) => {
  const iframeSend = (data: any) => {
    res.write(`<script type='text/javascript'>parent.showMsg(${JSON.stringify(data)})</script>`)
  }
  // res.set("connection", "keep-alive")
  // res.set("content-type", "text/html;charset=utf-8")
  EVENT.addListener(MSG_POST, iframeSend)
  req.socket.on("close", () => {
    console.log("iframe socket close")
    EVENT.removeListener(MSG_POST, iframeSend)
  })
}

export const ssePage = (req: Request, res: Response) => {
  res.render("sse", {
    title: "Server Send Event",
  })
}

export const sseApi = (req: Request, res: Response) => {
  const sseSend = (data: any) => {
    res.write("1retry:10000\n")
    res.write("event:my_msg\n")
    res.write(`data:${JSON.stringify(data)}\n\n`)
  }
  res.set("Content-Type", "text/event-stream")
  res.set("Cache-Control", "no-cache")
  res.set("Connection", "keep-alive")

  res.statusCode = 200

  res.write("retry:10000\n")
  res.write("event:my_msg\n\n")

  EVENT.addListener(MSG_POST, sseSend)

  req.socket.on("close", () => {
    console.log("sse socket close")
    EVENT.removeListener(MSG_POST, sseSend)
  })
}

export const websocketPage = (req: Request, res: Response) => {
  res.render("websocket", {
    title: "websocket",
  })
}
