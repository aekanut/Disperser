const express = require('express');
const app = express();
const router = require('./route/routes')
const api = require('./route/api')
const admin = require('./route/admin')
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"], transports: ['websocket', 'polling'], credentials: true }, allowEIO3: true });
const smc = require('./src/smc');

const PORT = 3000;

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use("/", router);

io.on('connection', socket => {
    console.log(`New connection from ${socket.id}`);

    socket.on('set-query', (data = {}) => {
        const {
            query = undefined
        } = data;
        console.log(`set-query: ${query}`);
        smc.setQuery(query);
    });

    socket.on('set-all-query', (data = {}) => {
        const {
            query = undefined
        } = data;
        console.log(`set-query: ${query}`);
        smc.setQuery(query);
    });

    socket.on('disconnect', () => {
        console.log('client disconnected');
    });
});

app.use("/api", api);

app.use("/api", admin)

server.listen(PORT, () => {
    console.log(`listening on port :${PORT}`);
    // connect to smart card reader after server started.
    // delay because if restart by pm2, need to wait connection from client to set query
    setTimeout(() => {
        smc.init(io);
    }, 1500);
});
