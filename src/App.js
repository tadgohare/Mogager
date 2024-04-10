import React, { useState, useEffect, memo } from "react";
//const db = require('./Database.js');

const App = () =>{
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('token') !== null);

    const handleLogout = () => {
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
    };
    return (
        <div>
            <h1>Mogager</h1>
            {/* <img src="/mogtrump.webp" alt="mogged" size="50%"></img> */}
            {!isLoggedIn && <UserRegistration setIsLoggedIn={setIsLoggedIn} />}
            <br></br>
            <UserLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            {isLoggedIn && <LogoutButton handleLogout={handleLogout} />}
            {isLoggedIn && <Dashboard />}
        </div>
    )
}

const UserLogin = ({isLoggedIn, setIsLoggedIn}) =>{
    const handleLogin = (e) => {
        e.preventDefault();
        const userData = {
            username: e.target[0].value,
            password:e.target[1].value
        };
        fetch('/user/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (!response.ok) {
                alert(response.statusText);
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem('userID', data.userid);
            sessionStorage.setItem('token', data.token);
            setIsLoggedIn(true);
            console.log('User login successful for ID: ',data.userid);
            console.log('Token: ',data.token);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    if (isLoggedIn) return null;
    return (
        <div className="container">
            <h2>Login to Mogager</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username"></input>
                <input type="password" placeholder="Password"></input>
                <button>Login</button>
            </form>
        </div>
    )
}

const UserRegistration = ({setIsLoggedIn}) =>{
    const handleSubmit = (e) => {
        e.preventDefault();
        if(e.target[5].value !== e.target[6].value){
            alert("Passwords do not match!");
            return;
        }
        
        if(!validateEmail(e.target[0].value)){
            alert("Please enter a valid email address");
            return;
        }

        const userData = {
            username: e.target[0].value,
            name: e.target[1].value,
            age: e.target[2].value,
            height: e.target[3].value,
            weight: e.target[4].value,
            gender: e.target.elements.gender.value,
            password:e.target[5].value
        };
        console.log(userData);
        
        //POST REQUEST to insert a user
        fetch('/sql/insert_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            sessionStorage.setItem('userID', data.userid);
            setIsLoggedIn(true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <div className="container">
            <h2>Start Looskmaxxing Today!</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Email"></input>
                <input type="text" placeholder="Name"></input>
                <input type="number" placeholder="Age" min="6"></input>
                <input type="number" placeholder="Height in cm" min="1"></input>
                <input type="number" placeholder="Weight in lb" min="1"></input>
                <input type="password" placeholder="Password"></input>
                <input type="password" placeholder="Confirm Password"></input>
                <div>
                    <input type="radio" id="male" name="gender" value="male" />
                    <label htmlFor="male">Male</label>
                    <input type="radio" id="female" name="gender" value="female" />
                    <label htmlFor="female">Female</label>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

const LogoutButton = ({handleLogout}) =>{
    return (
        <button onClick={handleLogout} className="logoutButton">Logout</button>
    )
}

const Dashboard = () => {
    // const [data, setData] = useState({name: 'User'}); //initial state is an object with name key set to 'User'
    const [data, setData] = useState(null);
    useEffect(() => {
        fetch('/sql/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            }
        }).then(response => {
            if (!response.ok) {
                alert(response.statusText);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            console.log('Dashboard Data: ',data);
            setData(data);

        }).catch((error) => {
            console.error('Error:', error);
        });
    }, []);
    return (
        <div>
            {data ? (
            <div>
                <h2>Dashboard for {data.name}</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Username</td>
                            <td>{data.username}</td>
                        </tr>
                        <tr>
                            <td>Name of personal trainer</td>
                            <td>{data.trainer_name}</td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td><input type="number" defaultValue={data.height} placeholder={data.height}/></td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td><input type="number" defaultValue={data.weight} placeholder={data.weight}/></td>
                        </tr>
                        <tr>
                            <td>Age</td>
                            <td>{data.age}</td>
                        </tr>
                        <tr>
                            <td>Gender</td>
                            <td>{data.gender}</td>
                        </tr>
                        <tr>
                            <td>Sessions</td>
                        </tr>
                        
                    </tbody>
                </table>
                {/* Session Table */}
                <UserSchedule />
            </div>
        ) : (
            'Loading...'
        )}
        </div>
    )
}

const UserSchedule = () => {
    const [sessions, setSessions] = useState([]);
    useEffect(() => {
        fetch('/sql/userschedule', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            }
        }).then(response => {
            if (!response.ok) {
                //
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            console.log('Session Data: ',data);
            setSessions(data);
        }).catch((error) => {
            console.error('Error:', error);
        });
    }, []);
    return (
        <div>
            <h3>Schedule</h3>
            <table>
                <thead>
                    <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Trainer Name</th>
                        <th>Room Name</th>
                    </tr>
                </thead>
                <tbody>
                {sessions.map((session, index) => {
                    const startTime = new Date(session.start_time);
                    const formattedStartTime = startTime.toLocaleString();

                    const endTime = new Date(session.end_time);
                    const formattedEndTime = endTime.toLocaleString();

                    return (
                        <tr key={index}>
                            <td>{formattedStartTime}</td>
                            <td>{formattedEndTime}</td>
                            <td>{session.trainer_name}</td>
                            <td>{session.room_name}</td>
                        </tr>
                    );
})}
                </tbody>
            </table>
        </div>
    )

}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

export default memo(App)