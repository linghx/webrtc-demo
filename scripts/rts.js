/*
 * @Author: your name
 * @Date: 2021-11-26 14:19:00
 * @LastEditTime: 2021-12-01 17:48:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webrtc-demo\scripts\rts.js
 */
const myCameraVideo = document.querySelector('#myCamera');
const localVideo = document.querySelector('#myVideo');
const startLiveBtn = document.querySelector('#screen');
const startCameraBtn = document.querySelector('#camera');
const screenPushBtn = document.querySelector('#screenPush');
const cameraPushBtn = document.querySelector('#cameraPush');


var aliRts = new AliRTS.createClient();
var aliRtsScreen = new AliRTS.createClient();
aliRts.on("onError", (err)=> {
    console.log(`errorCode: ${err.errorCode}`);
    console.log(`message: ${err.message}`);
  })
  aliRtsScreen.on("onError", (err)=> {
    console.log(`errorCode: ${err.errorCode}`);
    console.log(`message: ${err.message}`);
  })
const audio = false;

let localCameraStream;
let localScreenStream;

startCameraBtn.addEventListener('click', startCameraVideo)

startLiveBtn.addEventListener('click', startLocalVideo)

screenPushBtn.addEventListener('click', pushScreenStream)

cameraPushBtn.addEventListener('click', pushCameraStream)
/**
 * 获取本地流localStream
 */
function startCameraVideo() {
    AliRTS.createStream({
        audio: audio ? false : true,
        video: true,
        screen: false,
    }).then((localStream) => {
        localCameraStream = localStream;
        // 预览推流内容，mediaElement是媒体标签audio或video
        localStream.play(localVideo);
    }).catch((err) => {
        // 创建本地流失败
    })
}

function startLocalVideo() {
    AliRTS.createStream({
        audio: audio ? false : true,
        video: false,
        screen: true,
    }).then((localStream) => {
        localScreenStream = localStream;
        // 预览推流内容，mediaElement是媒体标签audio或video
        localStream.play(myCameraVideo);
    }).catch((err) => {
        // 创建本地流失败
    })
}
/**
 * 开始推流
 */
function pushScreenStream() {
    
    aliRtsScreen.publish('artc://sitkpush.estudy.cn/live-nsr/IKUKO1007188?&auth_key=1638353901677-0-0-31e92294a60d087757b26883abf327e9&wm=1', localScreenStream)
    .then(() => {
        console.log('【屏幕】推流成功')
        // 推流成功
    }).catch((err) => {
        console.log('【屏幕】推流失败', err)
        // 推流失败
    })
}

function pushCameraStream() {
    aliRts.publish('artc://sitkpush.estudy.cn/live-nsr/IKUKO1007245?&auth_key=1638353953614-0-0-96a307b5b082faeb0f31758df530baa4&wm=1', localCameraStream)
    .then(() => {
        console.log('【摄像头】推流成功')
        // 推流成功
    }).catch((err) => {
        console.log('【摄像头】推流失败', err)
        // 推流失败
    })
}

window.addEventListener('beforeunload', (event) => {
    aliRts.unpublish();
    aliRtsScreen.unpublish();
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = '';
  });
  