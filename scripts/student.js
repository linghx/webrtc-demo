/*
 * @Author: your name
 * @Date: 2021-12-01 17:34:54
 * @LastEditTime: 2021-12-01 17:49:00
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \webrtc-demo\scripts\student.js
 */

const myVideo = document.querySelector('#myVideo');
const teacherVideo = document.querySelector('#teacherVideo');
const startCameraBtn = document.querySelector('#camera');
const cameraPushBtn = document.querySelector('#cameraPush');

startCameraBtn.addEventListener('click', startCameraVideo)
cameraPushBtn.addEventListener('click', pushCameraStream)

var aliRts = new AliRTS.createClient();
aliRts.on("onError", (err)=> {
    console.log(`errorCode: ${err.errorCode}`);
    console.log(`message: ${err.message}`);
  })


  function startCameraVideo() {
    AliRTS.createStream({
        audio: true,
        video: true,
        screen: false,
    }).then((localStream) => {
        localCameraStream = localStream;
        // 预览推流内容，mediaElement是媒体标签audio或video
        localStream.play(myVideo);
    }).catch((err) => {
        // 创建本地流失败
    })
}

function pushCameraStream() {
    aliRts.publish('artc://sitkpush.estudy.cn/live-nsr/IKUKO1007245?&auth_key=1638353953614-0-0-96a307b5b082faeb0f31758df530baa4&wm=1', localCameraStream)
    .then(() => {
        console.log('【摄像头】推流成功')
        pullTeacherStream();
        // 推流成功
    }).catch((err) => {
        console.log('【摄像头】推流失败', err)
        // 推流失败
    })
}

    /** 
 * rts开始拉流接口 
 * @param {String} pullStreamUrl 拉流地址 
 * @param {HTMLMediaElement} mediaElement 播放视频的video标签 
 * @return {Promise}  
 */ 
function pullTeacherStream() {

    aliRts.startLiveStream('artc://sitklive.estudy.cn/live-nsr/artc-test?auth_key=1640943799-0-0-32c359c45fb7b5ac3e429bf416fe8b97', teacherVideo);
}

window.addEventListener('beforeunload', (event) => {
    aliRts.unpublish();
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = '';
  });