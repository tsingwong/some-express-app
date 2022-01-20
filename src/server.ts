/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-19 11:36:45
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-01-20 22:44:46
 */

import errorHandler from "errorhandler"
import app from "./app"
import webSocket from "websocket"

import { EVENT, MSG_POST } from "./controllers/sendData"

const WebSocketServer = webSocket.server

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler)
}

const server = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    // 内置属性，默认是 process.env.NODE_ENV,该结果不存在时默认为 `development`
    app.get("env"),
  )
  console.log("  Press CTRL-C to stop\n")
})

const wss = new WebSocketServer({
  httpServer: server,
})

wss.on("request", (req) => {
  let connection = req.accept(undefined, req.origin)

  let wssSend = (data: any) => {
    connection.send(JSON.stringify(data))
  }
  connection.on("message", (msg) => {
    console.log(msg)
  })

  connection.on("close", (con) => {
    console.log("websocket close")
    EVENT.removeListener(MSG_POST, wssSend)
  })

  EVENT.addListener(MSG_POST, wssSend)
})

export default server
