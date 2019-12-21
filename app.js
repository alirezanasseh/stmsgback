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
require('./config');

global.server = `http://${IP}:${PORT}/`;

app.use(cors());
app.use(express.json());
app.use('/register', register);
app.use('/login', login);
app.use('/upload', upload);
app.use('/download', download);
app.use(['/users', '/countries', '/cities', '/messages', '/permissions', '/sessions', '/sockets'], api);

server.listen(port, () => console.log(`Server is running on port ${port}`));

io.on('connection', (socket) => {
    let token = socket.handshake.query.token;
    if(token){
        let sessionModel = require('./models/sessions').model({token: token, noAccessCheck: true});
        sessionModel.getOneByCondition({token: token}, (err, sesResult) => {
            if(err){
                console.log("app.js:32", err)
            }else{
                if(sesResult){
                    let socketModel = require('./models/sockets').model({token: token, noAccessCheck: true});
                    socketModel.getOneByCondition({token: token}, (err, socketResult) => {
                        if(err){
                            console.log("app.js:38", err);
                        }else{
                            if(socketResult){
                                socketResult.socket_id = socket.id;
                                socketModel.put(socketResult, (err, updateResult) => {
                                    if(err){
                                        console.log("app.js:44", err);
                                    }else{
                                        // Socket updated!
                                    }
                                });
                            }else{
                                let socketData = {
                                    socket_id: socket.id,
                                    token: token,
                                    user_id: sesResult.user_id
                                };
                                socketModel.post(socketData, (err, insertResult) => {
                                    if(err){
                                        console.log("app.js:57", err);
                                    }else{
                                        // Socket saved!
                                    }
                                });
                            }
                        }
                    });
                }else{
                    console.log("app.js:66 - Token not found!");
                }
            }
        });
    }

    socket.on('SEND_MESSAGE', data => {
        validateToken(data.token, (err, userResult) => {
            if(err){
                console.log("app.js:75", err);
            }else{
                let messageData = {
                    chat_id: -1,
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
                        console.log("app.js:90", err);
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
            }
        });
    });
});
