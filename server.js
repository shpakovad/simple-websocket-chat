const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const wss = new WebSocket.Server({port: 3001});

wss.on('connection', (ws) => {

    ws.id = uuid();

    // 1. Send client's id
    ws.send(JSON.stringify({
        type: 'welcome',
        yourId: ws.id
    }));

    // 2. Let EVERYONE ELSE know about new user
    wss.clients.forEach((client) => {
        if (client.id !== ws.id && client.readyState === 1) {
            console.log('Client connected', client.id, ws.id);
            client.send(JSON.stringify({
                id: ws.id,
                type: 'system',
                message: `👤 User ${ws.id} joined`
            }));
        }
    });

});

console.log('🚀 WebSocket сервер запущен на ws://localhost:3001');