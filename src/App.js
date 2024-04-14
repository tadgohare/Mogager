import React, { useState, useEffect, memo, useRef } from "react";

const App = () =>{
    const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('token') !== null);
    const [role, setRole] = useState(sessionStorage.getItem('role'));

    const handleLogout = () => {
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('adminID');
        sessionStorage.removeItem('trainerID');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
        setRole(null);
    };
    return (
        <div>
            <h1>Mogager</h1>
            {/* <img src="/mogtrump.webp" alt="mogged" size="50%"></img> */}
            {!isLoggedIn && <UserRegistration setIsLoggedIn={setIsLoggedIn} />}
            <br></br>
            <UserLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setRole={setRole}/>
            <br></br>
            <TrainerLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setRole={setRole}/>
            <br></br>
            <AdminLogin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setRole={setRole}/>
            {isLoggedIn && <LogoutButton handleLogout={handleLogout} />}
            {isLoggedIn && role === 'user' && <UserDashboard />}
            {isLoggedIn && role === 'trainer' && <TrainerDashBoard />}
            {isLoggedIn && role === 'admin' && <AdminDashboard />}
        </div>
    )
}



const TrainerLogin = ({isLoggedIn, setIsLoggedIn}) =>{
    const handleLogin = (e) => {
        e.preventDefault();
        const userData = {
            username: e.target[0].value.toLowerCase(),
            password:e.target[1].value
        };
        fetch('/trainer/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        }).then(response => {
            if (!response.ok) {
                alert(response.statusText);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            sessionStorage.setItem('trainerID', data.trainerid);
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('role', 'trainer');
            setIsLoggedIn(true);
            console.log('Trainer login successful for ID: ',data.trainerid);
            console.log('Token: ',data.token);
        });
    }
    if (isLoggedIn) return null;
    return (
        <div className="container">
            <h2>Trainer Login to Mogager</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Email"></input>
                <input type="password" placeholder="Password"></input>
                <button>Login as Trainer</button>
            </form>
        </div>
    )
}

const AddTrainer = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const trainerData = {
            name: e.target[0].value,
            username: e.target[1].value.toLowerCase(),
            password:e.target[2].value
        };
        console.log(trainerData);
        
        //POST REQUEST to insert a user
        fetch('/sql/insert_trainer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify(trainerData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert("Trainer added successfully!");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    return(
        <div>
            <h2>Add Trainer</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name"></input>
                <input type="text" placeholder="Username/Email"></input>
                <input type="password" placeholder="Password"></input>
                <button>Add Trainer</button>
            </form>
        </div>
    );
};

const AdminLogin = ({isLoggedIn, setIsLoggedIn}) =>{
    const handleLogin = (e) => {
        e.preventDefault();
        const userData = {
            username: e.target[0].value.toLowerCase(),
            password:e.target[1].value
        };
        fetch('/admin/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        }).then(response => {
            if (!response.ok) {
                alert(response.statusText);
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            sessionStorage.setItem('adminID', data.adminid);
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('role', 'admin');
            setIsLoggedIn(true);
            console.log('Admin login successful for ID: ',data.adminid);
            console.log('Token: ',data.token);
        });
    }
    if (isLoggedIn) return null;
    return (
        <div className="container">
            <h2>Admin Login to Mogager</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username"></input>
                <input type="password" placeholder="Password"></input>
                <button>Login as Admin</button>
            </form>
        </div>
    )
}

const UserLogin = ({isLoggedIn, setIsLoggedIn}) =>{
    const handleLogin = (e) => {
        e.preventDefault();
        const userData = {
            username: e.target[0].value.toLowerCase(),
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
            sessionStorage.setItem('role', 'user');
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
                <input type="text" placeholder="Username/Email"></input>
                <input type="password" placeholder="Password"></input>
                <button>Login as User</button>
            </form>
        </div>
    )
}

const UserRegistration = () =>{
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
            username: e.target[0].value.toLowerCase(),
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
            alert("User added successfully! Try loggin in now!");
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

const TrainerDashBoard = () => {
    return (
        <div className="container">
            <h2>Trainer Dashboard</h2>
            <TrainerSchedule />
        </div>
    )
}

const TrainerSchedule = () => {
    const [sessions, setSessions] = useState([]);
    useEffect(() => {
        fetch('/sql/trainer_schedule', {
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
                        <th>User Name</th>
                    </tr>
                </thead>
                <tbody>
                {sessions.map((session, index) => {
                    const startTime = new Date(session.start_time);
                    const formattedStartTime = startTime.toLocaleString();

                    return (
                        <tr key={index}>
                            <td>{formattedStartTime}</td>
                            <td>{session.client_name}</td>
                        </tr>
                    );
})}
                </tbody>
            </table>
        </div>
    )
};


const ScheduleBooking = () => {
    const [bookingData, setBookingData] = useState({ date: '', time: '', trainer: '' });

    const handleInputChange = (event) => {
        setBookingData({ ...bookingData, [event.target.name]: event.target.value });
    };

    //POST REQUEST to insert a user
    const handleSubmit = (event) => {
        event.preventDefault();

        // Combine date and time into a single ISO 8601 timestamp string
        const timestamp = `${bookingData.date}T${bookingData.time}:00`;

        // Replace the date and time fields with the combined timestamp
        const dataToSend = { ...bookingData, timestamp, userid: sessionStorage.getItem('userID') };
        console.log(dataToSend);

        fetch('/sql/add_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert("Session added successfully!");
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    return (
        <div>
            <h2>Book a Session</h2>
            <form onSubmit={handleSubmit}>
                <input type="date" name="date" onChange={handleInputChange} required />
                <input type="time" name="time" onChange={handleInputChange} required />
                <input type="text" name="trainer" placeholder="Trainer" onChange={handleInputChange} required />
                <button type="submit">Book</button>
            </form>
        </div>
    );
};

const AdminDashboard = () => {
    return(
        <div className="container">
            <h2>Admin Dashboard</h2>
            <EquipmentList />
            <AddRoom />
            <AddEquipment />
            <AddTrainer />
            <button>Process Payments</button>
        </div>
    );
}

const EquipmentList = () => {
    const [equipment, setEquipment] = useState([]);
    useEffect(() => {
        fetchEquipment().catch((error) => {
            console.error('Error fetching equipment:', error);
        });
    }, []);

    const fetchEquipment = async () => {
        const response = await fetch('/sql/getequipment', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log('Equipment Data: ', data);
        setEquipment(data);
    };

    const toggleRepairStatus = async (assetTag) => {
        // Find the equipment with the given asset tag
        const equip = equipment.find(e => e.asset_tag === assetTag);

        if (equip) {
            // Toggle the repair status
            equip.needs_repair = !equip.needs_repair;

            const response = await fetch(`/sql/repair_equipment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    asset_tag: equip.asset_tag,
                    needs_repair: equip.needs_repair,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update the equipment state to trigger a re-render
            setEquipment(equipment);
        }
    };
    return (
        <div>
            <h3>Equipment List</h3>
            <table>
                <thead>
                    <tr>
                        <th>Asset Tag</th>
                        <th>Equipment Name</th>
                        <th>Room Name</th>
                    </tr>
                </thead>
                <tbody>
                {equipment.map((equip, index) => {
                    return (
                        <tr key={index}>
                            <td>{equip.asset_tag}</td>
                            <td>{equip.name}</td>
                            <td>{equip.room_name}</td>
                            <td>
                                <button onClick={() => toggleRepairStatus(equip.asset_tag)}>
                                    {equip.needs_repair ? 'Mark as Repaired' : 'Mark as Needs Repair'}
                                </button>
                            </td>
                        </tr>
                    );
})}
                </tbody>
            </table>
        </div>
    )

}

const AddRoom = () => {
    const roomNameRef = useRef();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const roomData = {
            name: roomNameRef.current.value,
            is_bookable: e.target.roomType.value,
        };
        console.log(roomData);
        
        //POST REQUEST to insert a user
        fetch('/sql/add_room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(roomData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input ref={roomNameRef} type="text" placeholder="Room Name"></input>
                <input type="radio" id="bookable" name="roomType" value={true} />
                <label htmlFor="bookable">Bookable</label>
                <input type="radio" id="notBookable" name="roomType" value={false} />
                <label htmlFor="notBookable">Not Bookable</label>
                <button type="submit" onSubmit={handleSubmit}>Add Room</button>
            </form>
        </div>
    );
}

async function getAllRooms() {
    try {
        const response = await fetch('/sql/get_rooms', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rooms = await response.json();
        console.log(rooms);
        return rooms.map(room => ({ id: room.roomid, name: room.name }));    
    } 
        catch (error) {
        console.error('An error occurred while getting the rooms:', error);
    }
}

const AddEquipment = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const fetchedRooms = await getAllRooms();
            setRooms(fetchedRooms);
        };
        fetchRooms();
    },[]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const equipmentData = {
            name: e.target[0].value,
            roomid: e.target[1].value,
        };
        //console.log('Equipment Data: ',equipmentData);
        await fetch('/sql/add_equipment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify(equipmentData),
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(data => {
            console.log('Equipment Data: ',data);
        }).catch((error) => {
            console.error('Error:', error);
        });

    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Equipment Name"></input>
                <select>
                    {rooms.map((room) => (
                        <option key={room.roomid} value={room.roomid}>{room.name}</option>
                    ))}
                </select>
                <button type="submit">Add Equipment</button>
            </form>
        </div>
    );
};


const UserDashboard = () => {
    const [data, setData] = useState(null);
    const heightRef = useRef();
    const weightRef = useRef();
    const usernameRef = useRef();

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

    const handleUpdate = async () => {
        if(!validateEmail(usernameRef.current.value)){
            alert("Please enter a valid email address");
            return;
        }
        data.height = heightRef.current.value;
        data.weight = weightRef.current.value;
        data.username = usernameRef.current.value;
        // setData(data);
        fetch('/sql/update_user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // setData(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    return (
        <div>
            {data ? (
            <div>
                <h2>Dashboard for {data.name}</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Username/Email</td>
                            <td><input ref={usernameRef} type="text" defaultValue={data.username} placeholder={data.username}/></td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td><input ref={heightRef} type="number" defaultValue={data.height} placeholder={data.height}/></td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td><input ref={weightRef} type="number" defaultValue={data.weight} placeholder={data.weight}/></td>
                        </tr>
                        <tr>
                            <td>Age</td>
                            <td>{data.age}</td>
                        </tr>
                        <tr>
                            <td>Gender</td>
                            <td>{data.gender}</td>
                        </tr>
                    </tbody>
                </table>
                <button className="updateUserInfo" onClick={handleUpdate}>Update</button>
                {/* Session Table */}
                <UserSchedule />
                <ScheduleBooking />
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
                        <th>Trainer Name</th>
                        <th>Room Name</th>
                    </tr>
                </thead>
                <tbody>
                {sessions.map((session, index) => {
                    const startTime = new Date(session.start_time);
                    const formattedStartTime = startTime.toLocaleString();
                    return (
                        <tr key={index}>
                            <td>{formattedStartTime}</td>
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

export default memo(App);