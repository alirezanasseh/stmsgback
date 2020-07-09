#!/usr/bin/env node

let express = require('express');
let app = express();
let server = require('http').Server(app);
let cors = require('cors');
let io = require('socket.io')(server);
let validateToken = require('./components/validate_token');
let register = require('./api/register');
let login = require('./api/login');
let upload = require('./api/upload');
let download = require('./api/download');
let api = require('./components/api');
let {IP, PORT} = require('./config');
let moment = require('moment');
let fs = require('fs');

global.server = `http://${IP}:${PORT}/`;

app.use(cors());
app.use(express.json());
app.use('/register', register);
app.use('/login', login);
app.use('/upload', upload);
app.use('/download', download);
app.use(['/users', '/messages', '/permissions', '/sessions'], api);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

let saveMessage = props => {
    let {data, userResult} = props;
    let messageData = {
        chat_id: data.chat_id,
        sender_id: userResult._id,
        sender_name: userResult.name,
        message: data.message,
    };
    if(data.file_id){
        messageData.file_id = data.file_id;
        messageData.file_name = data.file_name;
    }
    let msgModel = require('./models/messages').model({token: data.token});
    msgModel.post(messageData, (err, insertMsg) => {
        if(err){
            fs.appendFile('logs.txt', JSON.stringify(err), err => {
                console.log(err);
            });
            //TODO: emit error to client
        }else{
            let resultMsg = {
                sender_name: userResult.name,
                message: data.message,
                local_index: data.local_index
            };
            if(data.file_id){
                resultMsg.file_id = data.file_id;
                resultMsg.file_name = data.file_name;
            }
            io.emit('RECEIVE_MESSAGE', resultMsg);
        }
    });
};

io.on('connection', (socket) => {
    let token = socket.handshake.query.token;
    if(token){
        let sessionModel = require('./models/sessions').model({token: token, noAccessCheck: true});
        sessionModel.getOneByCondition({token: token}, (err, sesResult) => {
            if(err){
                fs.appendFile('logs.txt', JSON.stringify(err), err => {
                    console.log(err);
                });
            }else{
                if(!sesResult){
                    fs.appendFile('logs.txt', "Token not found", err => {
                        console.log(err);
                    });
                }
            }
        });
    }

    socket.on('SEND_MESSAGE', data => {
        validateToken(data.token, (err, userResult) => {
            if(err){
                fs.appendFile('logs.txt', "token : " + JSON.stringify(err), err => {
                    console.log(err);
                });
                //TODO: emit error to client
            }else{
                // Checking if the user is in this chat
                let chatModel = require('./models/chats').model({noAccessCheck: true});
                chatModel.getOneByCondition({
                    _id: data.chat_id,
                    users: {$in: [userResult._id]}
                }, (err, chatResult) => {
                    if(err){
                        fs.appendFile('logs.txt', "search user in chat : " + JSON.stringify(err), err => {
                            console.log(err);
                        });
                        //TODO: emit error to client
                    }else{
                        if(chatResult) {
                            saveMessage({data, userResult});
                        }else{
                            err = `user ${userResult._id} is not in chat ${chatResult._id}`;
                            fs.appendFile('logs.txt', err, err => {
                                console.log(err);
                            });
                            //TODO: emit error to client
                        }
                    }
                });
            }
        });
    });
});
