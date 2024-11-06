// src/components/User.js
import React, { useState } from 'react';
import { userService } from '../api';

const User = () => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await userService.get('/users');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    return (
        <div>
            <h2>User</h2>
            <button onClick={fetchUser}>Fetch User</button>
            {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
        </div>
    );
};

export default User;
