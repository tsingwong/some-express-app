/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-25 17:14:13
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-02-07 19:42:12
 */
import { Request, Response } from "express"
import { createUser, getUserInfo } from "../services/user"

interface Realm {
  realm: string
  path: string
  users: Array<string>
}

interface Role {
  username: string
  password: string
}

// 权限表
const realms: Array<Realm> = [
  {
    realm: "HTTPBasicAuthentication",
    path: "/HTTPBasicAuthentication",
    users: ["tsingwong"],
  },
]
// 用户表
const users: Array<Role> = [
  {
    username: "tsingwong",
    password: "123456",
  },
]

// 查找空间
function findRealm(path: string) {
  return realms.find((item) => path.indexOf(item.path) > -1)
}

// 查找用户
function findUser(username: string, password: string) {
  return users.find((user) => user.username === username && user.password === password)
}

// 用户是否有权限
function isUserInRealm(realmItem: Realm, username: string) {
  return realmItem.users.indexOf(username) > -1
}

export const HTTPBasicAuthenticationPage = (req: Request, res: Response) => {
  res.render("HTTPBasicAuthentication", {
    title: "HTTPBasicAuthentication",
  })
}

export const HTTPBasicAuthenticationApi = (req: Request, res: Response) => {
  const { path } = req
  const realItem = findRealm(path)
  const realm = realItem?.realm
  const authorization = req.get("authorization")
  if (!authorization) {
    res.set({
      "WWW-Authenticate": `Basic realm="${encodeURIComponent(realm!)}"`,
    })
    res.status(401).send({
      code: 401,
      msg: "realm 错误",
    })
    return
  } else {
    const usernamePassword = authorization.split(" ")[1]
    const [username, password] = Buffer.from(usernamePassword, "base64").toString().split(":")

    if (!isUserInRealm(realItem!, username)) {
      res.status(403).send({
        code: 403,
        msg: "该用户不存在",
      })
      return
    }
    const user = findUser(username, password)
    if (!user) {
      res.status(403).send({
        code: 403,
        msg: "密码错误",
      })
      return
    }
    res.send({
      code: 0,
      username,
    })
  }
}

export const cookiePage = (req: Request, res: Response) => {
  let isLogin = false
  let userInfo = {}
  if (req.session.userInfo?.username) {
    isLogin = true
    userInfo = { ...req.session.userInfo }
  }
  res.render("cookie", {
    title: "Cookie",
    isLogin,
    userInfo,
  })
}

export const cookieApi = async (req: Request, res: Response) => {
  const { username, password } = req.body
  let data = await getUserInfo(username, password)
  if (!req.session.userInfo) {
    req.session.userInfo = {}
  }
  if (data.username === username) {
    if (data.password === password) {
      req.session.userInfo!.username = username
      req.session.save()
      res.send({
        code: 0,
        msg: "登录成功",
      })
      return
    } else {
      res.send({
        code: 1,
        msg: "密码错误",
      })
      return
    }
  }
  res.send({
    code: 1,
    msg: "账户不存在",
  })
  return
}
export const loginSuccessPage = (req: Request, res: Response) => {
  res.render("loginSuccess", {
    title: "登录成功",
  })
}
export const registerPage = (req: Request, res: Response) => {
  res.render("register", {
    title: "注册",
  })
}

export const registerApi = async (req: Request, res: Response) => {
  const { username, password } = req.body
  let data = await createUser(username, password)
  if (data === "OK") {
    res.send({
      code: 0,
      msg: "",
    })

    return
  }
  res.send({
    code: 1,
    msg: "创建错误",
  })
}

export const logoutApi = async (req: Request, res: Response) => {
  if (!req.session.userInfo?.username) {
    res.send({
      code: 1,
      msg: "当前用户未登录",
    })
    return
  } else {
    req.session.destroy(() => {
      res.send({
        code: 0,
        msg: "退出登录成功",
      })
      return
    })
  }
}
