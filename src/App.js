import React from "react";

const App = () =>{
    return (
        <div>
            <h1>Mogager</h1>
            <img src="/mogtrump.webp" alt="mogged"></img>
            <UserRegistration />
        </div>
    )
}

const UserRegistration = () =>{
    return (
        <div className="container">
            <h2>Start Looskmaxxing Today!</h2>
            <form>
                <input type="text" placeholder="Username"></input>
                <input type="password" placeholder="Password"></input>
                <input type="password" placeholder="Confirm Password"></input>
                <div>
                    <input type="radio" id="male" name="gender" value="male" />
                    <label for="male">Male</label>
                    <input type="radio" id="female" name="gender" value="female" />
                    <label for="female">Female</label>
                </div>
                <button>Register</button>
            </form>
        </div>
    )
}

export default App