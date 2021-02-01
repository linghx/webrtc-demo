/*
 * @Author: your name
 * @Date: 2020-12-21 14:12:35
 * @LastEditTime: 2021-01-14 21:07:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webrtc-test\scripts\main.js
 */
const localVideo = document.querySelector('#myVideo');
const remoteVideo = document.querySelector('#remoteVideo');
const mediaOptions = document.querySelector('#mediaOptions');
const cameraOptions = document.querySelector('#cameraOptions');
const startLiveBtn = document.querySelector('#startLive');
const constraints = { video: true, audio: true };
const userType = getQueryString('type');
let startLiveStatus = false;

if (userType === 'offer') {
    startLiveBtn.classList.remove('hide')
}

if(!IsPC()) {
    mediaOptions.classList.add('hide');
    cameraOptions.classList.remove('hide');
    mediaOptions.value = 'camera';
    constraints.video = {
        facingMode: cameraOptions.value
    }

    cameraOptions.onchange = function () {
        constraints.video = {
            facingMode: cameraOptions.value
        }
        getMediaStream(constraints)
            .then(stream => {
                addStream(stream)
            })
    }
}else {
    mediaOptions.onchange = function () {
        getMediaStream(constraints)
            .then(stream => {
                addStream(stream)
            })
    }
}


startLiveBtn.onclick = function () {
    if (!startLiveStatus) {
        startLiveStatus = true;
        startLive();
    }
}

localVideo.onloadeddata = () => {
    console.log('播放本地视频');
    localVideo.play();
}
remoteVideo.onloadeddata = () => {
    console.log('播放对方视频');
    remoteVideo.play();
}


const pcConfig = {
    'iceServers': [{
        'urls': 'stun:stun.srs.stg.closeli.cn:3478'
    }, {
        'urls': 'turn:srs.stg.closeli.cn:3478',
        'credential': '123456',
        'username': 'tianye'
    }]
}

// 初始化 RTCPeerConnection
const peer = new RTCPeerConnection();
peer.ontrack = e => {
    console.log('ontrack ', e)
    if (e && e.streams) {
        remoteVideo.srcObject = e.streams[0]
    }
}

// 为远程提供候选信息
peer.onicecandidate = e => {
    console.log('onicecandidate ', e)
    if (e.candidate) {
        socket.emit('message', {
            type: 'candidate',
            iceCandidate: e.candidate
        })
    }
}

// 监测 ICE 连接的状态
peer.oniceconnectionstatechange = e => {
    console.log('iceconnectionstatechange ', peer.iceConnectionState )
}

const localChannel = peer.createDataChannel('localChannel', {negotiated: true, id: 1});
const receiveDataBox = document.querySelector('#receiveDataBox');
const sendData = document.querySelector('#sendData');
const content = document.querySelector('#content');


localChannel.onmessage = function(e) {
    console.log("localChannel message: " + e.data);
    let liEl = document.createElement('li');  
    liEl.textContent = e.data;
    receiveDataBox.appendChild(liEl)
}

localChannel.onopen = function(e) {
    console.log('localChannel open ',e)
}

sendData.onclick = function() {
    if(localChannel.readyState != 'open') {
        alert('RTCDataChannel 数据通道未开启')
        return
    }
    if(content.value){
        localChannel.send(content.value);
        content.value = ''
    }
}


const socket = 
io.connect('//172.17.55.153/'); 
// io.connect('//121.5.68.178/');
socket.on('connect', function (event) {});
socket.on('message', data => {
    console.log('receive message: ', data)
    if (typeof data != 'object') return;
    const { type, sdp, iceCandidate } = data;
    // 收到远端的sdp
    if (type === 'offer' && !startLiveStatus) {
        const offerSdp = new RTCSessionDescription({ type, sdp });
        startLive(offerSdp);
    }
    else if (type === 'answer') {
        const offerSdp = new RTCSessionDescription({ type, sdp });
        peer.setRemoteDescription(offerSdp);
    }
    // 收到远端的ice候选信息
    else if (type === 'candidate') {
        peer.addIceCandidate(iceCandidate)
    }
})


function startLive(offerSdp) {
    getMediaStream(constraints)
        .then(stream => {
            startLiveBtn.classList.remove('hide');
            startLiveBtn.innerHTML = '正在通话';
            addStream(stream);

            if (!offerSdp) {
                createOffer()
            }
            else {
                createAnswer(offerSdp)
            }
        })
        .catch((error) => {
            alert(error)
        })
}

function createOffer(){
    console.log('创建本地sdp')
    peer.createOffer()
    .then(offer => {
        peer.setLocalDescription(offer)
        socket.emit('message', offer);
    })
    .catch(err => {
        console.log(err)
    })
}

function createAnswer(offerSdp){
    console.log('接收到发送方SDP')
    peer.setRemoteDescription(offerSdp)
        .then(() => {
            console.log('创建接收方（应答）SDP');
            peer.createAnswer()
                .then(answer => {
                    socket.emit('message', answer);
                    peer.setLocalDescription(answer);
                })
        })
}

function getMediaStream(constraints) {
    if (mediaOptions.value === 'camera') {
        return getUserMedia(constraints)
    }
    else if (mediaOptions.value === 'desktop') {
        return getDisplayMedia(constraints)
    }
}

function addStream(stream) {
    localVideo.srcObject = stream;
    stream.getTracks().forEach(track => {
        peer.addTrack(track, stream)
    });
}

function getDisplayMedia(constraints) {
    try {
        return navigator.mediaDevices.getDisplayMedia(constraints)
    } catch (error) {
        console.log('getDisplayMedia error ', error)
        return Promise.reject(
            new Error('getDisplayMedia is not supported in this browser')
        );
    }
}

function getUserMedia(constraints) {
    try {
        return navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
        console.log('getUserMedia error ', error)
        return Promise.reject(
            new Error('getUserMedia is not supported in this browser')
        );
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
	var flag = true;

	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}

	return flag;
}




    // 'iceServers': [{
    //     'urls': 'stun:stun.ideasip.com:3478'
    // }, {
    //     'urls': 'stun:stun.schlund.de:3478'
    // }, {
    //     'urls': 'stun:stun.voiparound.com:3478'
    // }, {
    //     'urls': 'stun:stun.voipbuster.com:3478'
    // }, {
    //     'urls': 'stun:stun.xten.com:3478'
    // }, {
    //     'urls': 'stun:stun.ekiga.net:3478'
    // }, {
    //     'urls': 'stun:stun.sipgate.net:3478'
    // }, {
    //     'urls': 'stun:stun.voipstunt.com:3478'
    // }, {
    //     'urls': 'stun:stun.counterpath.com:3478'
    // }, {
    //     'urls': 'stun:stun.counterpath.net:3478'
    // }, {
    //     'urls': 'stun:stun.gmx.net:3478'
    // }, {
    //     'urls': 'stun:stun.callwithus.com:3478'
    // }, {
    //     'urls': 'stun:stun.internetcalls.com:3478'
    // }, {
    //     'urls': 'stun:stun.viagenie.ca:3478'
    // }, {
    //     'urls': 'stun:stun.fwdnet.net:3478'
    // }, {
    //     'urls': 'stun:stun.softjoys.com:3478'
    // }]