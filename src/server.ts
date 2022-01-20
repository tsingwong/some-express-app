/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-19 11:36:45
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-01-19 12:00:05
 */

import errorHandler from 'errorhandler'
import app from './app'

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandler)
}

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    // 内置属性，默认是 process.env.NODE_ENV,该结果不存在时默认为 `development`
    app.get('env'),
  )
  console.log('  Press CTRL-C to stop\n')
})

export default server
