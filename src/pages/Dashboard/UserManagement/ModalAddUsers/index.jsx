import React, { useState } from 'react';
import './add.css';

const ModalAddUsers = ({onClose, onSubmit}) => {

    const [formUser, setFormUser] = useState({
        fullName: '',
        email: '',
        password: '',
        dob: '',
        gender: 1,
        phone: '',
        role: 'user'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formUser);
        onClose();
    }

    return (
        <div className="modalOverlay">
            <div className="modal">
                <h3>Add new user</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required/>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <input type="date" name="dob" onChange={handleChange}/>
                    <select name="gender" onChange={handleChange}>
                        <option value="default">---Select gender---</option>
                        <option value={1}>Male</option>
                        <option value={0}>Female</option>
                    </select>
                    <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
                    <select name="role" onChange={handleChange}>
                        <option value="default">---Select role---</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    <div className="modalActions">
                        <button type="submit">Submit</button>
                        <button type="cancel" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default ModalAddUsers;