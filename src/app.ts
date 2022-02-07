/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-18 19:25:03
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-02-07 19:37:49
 */
import express from "express"
import path from "path"
import session from "express-session"
import connectRedis from "connect-redis"

import * as sendDataController from "./controllers/sendData"

import * as authController from "./controllers/auth"

import CONFIG from "./config/db"
import redisClient from "./db/redis"

// redis
const RedisStore = connectRedis(session)

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

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: "1q2w3e4r!!",
    resave: false,
    cookie: {
      maxAge: 60 * 1000,
    },
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
app.get("/HTTPBasicAuthentication", authController.HTTPBasicAuthenticationPage)
app.get("/cookie", authController.cookiePage)
app.get("/loginSuccess", authController.loginSuccessPage)
app.get("/register", authController.registerPage)

// api
app.post("/post", sendDataController.postApi)
app.post("/polling", sendDataController.pollingApi)
app.post("/longPolling", sendDataController.longPollingApi)
app.get("/iframeApi", sendDataController.iframeApi)
app.get("/sseApi", sendDataController.sseApi)
app.post("/HTTPBasicAuthentication", authController.HTTPBasicAuthenticationApi)
app.post("/cookie", authController.cookieApi)
app.post("/register", authController.registerApi)
app.post("/logout", authController.logoutApi)

export default app
