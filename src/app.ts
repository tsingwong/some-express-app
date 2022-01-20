/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-18 19:25:03
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-01-20 22:32:16
 */
import express from "express"
import path from "path"
import http from "http"

import * as sendDataController from "./controllers/sendData"
import * as apiController from "./controllers/api"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("port", process.env.PORT || 3000)
app.set("views", path.join(__dirname, "../views"))
app.set("view engine", "pug")

app.use(
  express.static(path.join(__dirname, "../views"), {
    maxAge: 24 * 60 * 60,
  }),
)

// router
app.get("/index", sendDataController.index)
app.get("/post", sendDataController.postPage)
app.get("/polling", sendDataController.pollingPage)
app.get("/longPolling", sendDataController.longPollingPage)
app.get("/iframe", sendDataController.iframePage)
app.get("/sse", sendDataController.ssePage)
app.get("/ws", sendDataController.websocketPage)
// api
app.post("/post", sendDataController.postApi)
app.post("/polling", sendDataController.pollingApi)
app.post("/longPolling", sendDataController.longPollingApi)
app.get("/iframeApi", sendDataController.iframeApi)
app.get("/sseApi", sendDataController.sseApi)

export default app
