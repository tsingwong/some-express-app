/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-02-07 14:40:11
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-02-07 16:16:37
 */
import redis from "../db/redis"

export async function getUserInfo(username: string, password?: string) {
  let res = await redis.hgetall(username)
  return res
}

export async function createUser(username: string, password: string) {
  let res = await redis.hmset(username, "username", username, "password", password)

  return res
}
