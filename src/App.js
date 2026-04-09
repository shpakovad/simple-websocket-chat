
import {useEffect, useRef, useState} from 'react';
import './App.css';

function App() {

    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState(null);
    const [newUsers, setNewUsers] = useState([]);
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
                        const newArr = [...prev, data.id];
                        const filtered = Array.from(new Set(newArr))
                        return filtered;
                    });
                }
            }


            wsRef.current = socket;
        },
        []
    );

    console.log(newUsers)
    return (
        <div className="App">
            {!isConnected && <div>Connection...</div>}
            {isConnected && user && <div>Welcome, {user}</div>}
            {isConnected && Boolean(newUsers.length) &&
                <div className="joined-users">
                    {newUsers
                        .filter(item => item !== user)
                        .map((user) =>
                            <div key={user}>{`User ${user} joined`}</div>)
                    }
                </div>
            }
        </div>
    );
}

export default App;
