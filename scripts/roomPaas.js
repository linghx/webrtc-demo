/*
 * @Author: your name
 * @Date: 2021-12-02 12:00:00
 * @LastEditTime: 2021-12-02 17:55:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webrtc-demo\scripts\roomPaas.js
 */
// 按需解构赋值
const { RoomEngine, EventNameEnum } = window.RoomPaasSdk;

// 获取RoomEngine实例
const roomEngineInstance = RoomEngine.getInstance();

// 获取设备号deviceId，唯一标识当前设备
// 在web端，不同的tab页代表不同设备
const deviceId = roomEngineInstance.getDeviceId();

// 配置参数
const config = {
  appKey, // 创建应用时分配的appKey
  appID, // 创建应用时分配的appId
  deviceId, // 设备号
  authTokenCallback, // 获取登录token的回调函数，需要返回Promise
}
// 传入配置
roomEngineInstance.init(config);