/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-02-07 14:36:41
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-02-07 14:36:42
 */
import Redis from "ioredis"
import CONFIG from "../config/db"

export default new Redis({ host: CONFIG.REDIS.HOST, port: CONFIG.REDIS.PORT })
