import React, { useState } from "react";
//const db = require('./Database.js');

const App = () =>{
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('userID') !== null);

    const handleLogout = () => {
        sessionStorage.removeItem('userID');
        setIsLoggedIn(false);
    };
    return (
        <div>
            <h1>Mogager</h1>
            <img src="/mogtrump.webp" alt="mogged"></img>
            {!isLoggedIn && <UserRegistration setIsLoggedIn={setIsLoggedIn} />}
            <br></br>
            <UserLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            {isLoggedIn && <LogoutButton handleLogout={handleLogout} />}
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
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem('userID', data.userid);
            setIsLoggedIn(true);
            console.log('User login successful for ID: ',data.userid);
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
                <input type="text" placeholder="Username"></input>
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

export default App