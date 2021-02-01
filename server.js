/*
 * @Author: your name
 * @Date: 2020-12-22 16:41:08
 * @LastEditTime: 2021-01-14 18:54:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \webrtc-test\server.js
 */
const server = require('http').createServer();
const io = require('socket.io')(server,{
    cors: {
        origin: "*",
        credentials: true
    }
});

const userList = new Map();
const connList = new Map();

io.on('connection', client => {
    client.on('start', userId => {
        let userConns = userList.get(userId);
        if (userConns == null) {
            userConns = new Map();
        }
        userConns.set(client, userId);
        userList.set(userId, userConns);
        connList.set(client, userId);
        console.log('新成员' + userId + '加入!当前连接人数为' + userList.size + "连接数量为:" + connList.size)
    })

    client.on('message', data => {
        client.broadcast.emit('message',data)
    });

    client.on('disconnect', () => {
        let userId = connList.get(client);
        if (userId) {
            let userConns = userList.get(userId);
            if (userConns) {
                userConns.delete(client);
            }
            if (userConns.size == 0) {
                userList.delete(userId);
            } else {
                userList.set(userId, userConns);
            }
            connList.delete(client)
        }
        console.log('成员' + userId + '已断开连接!当前连接人数为' + userList.size + "连接数量为:" + connList.size)
    });
});
server.listen(8001);