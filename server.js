const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const wss = new WebSocket.Server({port: 3001});
const messageHistory = [];
console.log({messageHistory})
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

    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        messageHistory.push(data)

        wss.clients.forEach((client) => {
            if (client.readyState === 1) {

                client.send(JSON.stringify({
                    type: 'system message',
                    messages: messageHistory
                }));
            }
        });
    });
});

console.log('🚀 WebSocket сервер запущен на ws://localhost:3001');