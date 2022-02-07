/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-01-12 12:08:23
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-02-07 17:11:40
 */
module.exports = {
  extends: ["alloy", "alloy/typescript"],
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
  },
  rules: {
    // 自定义你的规则
  },
}
