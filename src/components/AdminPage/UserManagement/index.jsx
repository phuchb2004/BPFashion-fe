import React, { useState, useEffect } from 'react';
import axiosSystem from '../../api/axiosSystem';
import ModalAddUsers from './ModalAddUsers';
import ConfirmModal from './ConfirmModal';
import './style.css';
import ModalUpdateUsers from './ModalUpdateUsers';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [showConfirmMd, setShowConfirmMd] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await axiosSystem.get('/GetAllUser');
            setUsers(res.user);
        }
        catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    //Handling Add Button
    const handleAdd = async (newUser) => {
        try {
            const res = await axiosSystem.post('/CreateUser', newUser);
            if (res.status === 200 || res.status === 201) {
                setUsers(prevUsers => [...prevUsers, res.user]);
                setShowModalAdd(false);
            }
            fetchUsers();
        }
        catch (error) {
            console.log(error); 
        }
    };

    const openModalAdd = () => {
        setShowModalAdd(true);
    };

    //Handling Update Button
    const handleUpdate = async (updatedUser) => {
        try {
            const res = await axiosSystem.put(`/UpdateUser/${selectedUserId}`, updatedUser);
            if (res.status === 200) {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === selectedUserId ? res.data : user
                    )
                );
            }
            setShowModalUpdate(false);
        } catch (error) {
            console.log(error);
        } finally {
            setSelectedUserId(null);
        }
    };      


    const openModalUpdate = async (id) => {
        try {
            const res = await axiosSystem.get(`/GetUserInfo/${id}`);
            if (res.status === 200) {
                setSelectedUserId(id);
                setEditingUser(res.data);
                setShowModalUpdate(true);
            }
        } catch (error) {
            console.log(error);
        }
    };  


    //Handling Delete Button
    const handleDelete = async () => {
        try {
            const res = await axiosSystem.delete(`/DeleteUser/${selectedUserId}`);
            if (res.status === 200) {
                setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUserId));
            }
            fetchUsers();
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setShowConfirmMd(false);
            setSelectedUserId(null);
        }
    };

    const openConfirmMd = (id) => {
        setShowConfirmMd(true);
        setSelectedUserId(id);
    };
    
    return (
        <>
            <h2 className="userTitle"> User Management </h2>
            <div className="buttons">
                <button className="addButton" onClick={openModalAdd}>+ Add User</button>
            </div>

            <div className="tableUsers">
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Phone Number</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{new Date(user.dob).toLocaleDateString('vi-VN')}</td>
                                <td>{user.gender === 1 ? 'Male' : 'Female'}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.role}</td>
                                <td className="actionButtons">
                                    <button className="actionButton edit" onClick={() => openModalUpdate(user.id)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="actionButton delete" onClick={() => openConfirmMd(user.id)}>
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModalAdd && (
                <ModalAddUsers
                    onClose={() => setShowModalAdd(false)}
                    onSubmit={handleAdd}
                />
            )}

            {showModalUpdate && editingUser && (
                <ModalUpdateUsers
                    userData={editingUser}
                    onClose={() => setShowModalUpdate(false)}
                    onSubmit={handleUpdate}
                />
            )}

            {showConfirmMd && (
                <ConfirmModal
                    onClose={() => setShowConfirmMd(false)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
}