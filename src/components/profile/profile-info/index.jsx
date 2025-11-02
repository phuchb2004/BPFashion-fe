import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import baseApi from '../../../api/baseApi';
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import ProfileForm from '../profile-form';
import './style.css';
import { 
    UserOutlined,
    HomeOutlined,
    DropboxOutlined
} from '@ant-design/icons';
import { 
    Menu,
    Spin,
    Card
} from 'antd';
import { showError, showWarning } from '../../../utils/notification';

export default function ProfileInfo() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUsers = useCallback(async (id) => {
        try {
            setLoading(true);
            const res = await baseApi.get(`/Users/GetUserInfo/${id}`);
            // Xử lý nhiều format response
            if (res) {
                setUser(res.data || res.user || res);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Không có dữ liệu user', error);
            const errorMsg = error.response?.data?.message || error.response?.message || 'Không thể tải thông tin người dùng!';
            showError('Không thể tải thông tin người dùng!', errorMsg);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetchUsers(userId);
        } else {
            setLoading(false);
            showWarning('Vui lòng đăng nhập để xem thông tin.');
            navigate('/login');
        }
    }, [fetchUsers, navigate]);

    const menuItems = [
        { 
            key: 'profile', 
            icon: <UserOutlined/>, 
            label: 'Thông tin tài khoản',
            onClick: () => navigate('/profile')
        },
        { 
            key: 'address', 
            icon: <HomeOutlined />, 
            label: 'Quản lý địa chỉ',
            onClick: () => navigate('/profile/address')
        },
        { 
            key: 'orders', 
            icon: <DropboxOutlined />, 
            label: 'Quản lý đơn hàng',
            onClick: () => navigate('/profile/orders')
        }
    ];

    return (
        <div className="profile-container">
            <Header />
            <div className="profile-page">
                <aside className="profile-sidebar">
                    <Card className="sidebar-card">
                        <Menu
                            onClick={(e) => {
                                const item = menuItems.find(i => i.key === e.key);
                                if (item && item.onClick) item.onClick();
                            }}
                            selectedKeys={['profile']}
                            mode="inline"
                            items={menuItems}
                            className="profile-menu"
                        />
                    </Card>
                </aside>

                <main className="profile-content">
                    <Card className="content-card">
                        {loading ? (
                            <div className="loading-wrapper">
                                <Spin size="large" />
                            </div>
                        ) : !user ? (
                            <div className="error-message">
                                Không tìm thấy thông tin người dùng.
                            </div>
                        ) : (
                            <ProfileForm user={user} fetchUsers={fetchUsers} />
                        )}
                    </Card>
                </main>
            </div>
            <Footer />
        </div>
    );
}

