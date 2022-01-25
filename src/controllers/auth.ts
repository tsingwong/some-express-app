/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-25 17:14:13
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-01-25 19:23:44
 */
import { Request, Response } from "express"

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
