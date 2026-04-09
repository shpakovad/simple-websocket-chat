import {useEffect, useRef, useState} from 'react';
import './App.css';

function App() {

    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState(null);
    const [newUsers, setNewUsers] = useState([]);

    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const [messageList, setMessageList] = useState([]);


    const wsRef = useRef(null);


    useEffect(
        () => {
            const socket = new WebSocket('ws://localhost:3001');
            socket.onopen = () => {
                setIsConnected(true)
            }
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data);

                if (data.type === 'welcome') {
                    setUser(data.yourId)
                }

                if (data.type === 'system') {
                    setNewUsers(prev => {
                        const newArr = [...prev, data.message];
                        return newArr;
                    });
                }
                if (data.type === 'system message') {
                    setMessageList(
                        data.messages.map(item => ({
                            ...item,
                            date: new Date(item.timestamp).toLocaleString(),
                        }))
                    );
                }
            }

            wsRef.current = socket;
        },
        []
    );

    const onSubmitForm = (e) => {
        e.preventDefault();

        if (wsRef.current?.readyState === 1) {
            wsRef.current.send(
                JSON.stringify(
                    {
                        user: username,
                        message: message,
                        timestamp: Date.now(),
                        type: 'system message'
                    }
                ));
        }

        setMessage('');
    }

    return (
        <div className="App">
            <div className="header">
                {!isConnected && <div>Connection...</div>}
                {
                    isConnected &&
                    <>
                        {user && <div className="greeting">Welcome, {user}</div>}

                        <form onSubmit={onSubmitForm} className="form">
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}/>
                            <input
                                type="text"
                                placeholder="Enter message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button type="submit" disabled={username.length === 0 || message.length === 0}>Send</button>
                        </form>

                        {Boolean(messageList.length) &&
                            <div className="chat">
                                {messageList.map((item, index) =>
                                    <div key={index} className="message-wrapper">
                                        <div className="message"><b>{item.user}</b>: {item.message}</div>
                                        <div className="date">{item.date}</div>
                                    </div>)}
                            </div>}
                    </>
                }
            </div>
            {isConnected && Boolean(newUsers.length) &&
                <div className="joined-users">
                    {newUsers
                        .filter(item => item !== user)
                        .map((user) =>
                            <div key={user}>{user}</div>)
                    }
                </div>
            }
        </div>
    );
}

export default App;
