/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-20 11:00:55
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-01-20 11:26:52
 */
import { Response, Request } from 'express'
export const pollingApi = (req: Request, res: Response) => {
  res.end(new Date().toLocaleString())
}
