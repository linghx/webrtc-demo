/*
 * @Author: your name
 * @Date: 2021-12-03 14:31:54
 * @LastEditTime: 2021-12-06 10:35:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webrtc-demo\scripts\aliyunWebRTC.js
 */

const myCameraVideo = document.querySelector('#myCamera');
const myScreen = document.querySelector('#myScreen');
var aliWebrtc = new AliRtcEngine();

aliWebrtc.startPreview(
    myCameraVideo    // html中的video元素
).then((res)=>{
    console.log('[startPreview]', res)
}).catch((error) => {
    // 预览失败
});

aliWebrtc.joinChannel({
    channel: 'test',        // 频道
    appid: 'ch6spwwf',          // 应用ID
    token: '17acf11c33e4467799a1a33af0458dc87c3434a3698803ee3314216722f18719',          // 令牌
    userid: 'user',         // 用户ID
    nonce: 'AK-1638780961',          // 随机码
    timestamp: 1638780961,      // token过期时间戳
    gslb: ["https://rgslb.rtc.aliyuncs.com"],           // gslb服务地址
}, 'student001').then((res)=>{
    // 入会成功
    console.log('[joinChannel] success', res)
} ,(error)=>{
    // 入会失败，打印错误内容，可以看到失败原因
    console.log('[joinChannel] fail',error.message);
});