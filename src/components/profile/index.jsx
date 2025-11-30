import React, { useState, useEffect, useCallback } from 'react';
import baseApi from '../../api/baseApi';
import './style.css';
import Header from "../layout/header";
import Footer from "../layout/footer";
import { 
    UserOutlined,
    HomeOutlined,
    DropboxOutlined
} from '@ant-design/icons';
import { 
    Menu,
    Spin,
    message
} from 'antd';
import ProfileForm from './profile-form';

const AddressView = () => <div>Nội dung quản lý địa chỉ</div>;
const OrderHistory = () => <div>Nội dung quản lý đơn hàng</div>;

const items = [
    { key: 'profile', icon: <UserOutlined/>, label: 'Thông tin tài khoản' },
    { key: 'address', icon: <HomeOutlined />, label: 'Quản lý địa chỉ'},
    { key: 'orders', icon: <DropboxOutlined />, label: 'Quản lý đơn hàng' }
];

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedKey, setSelectedKey] = useState("profile");

    const fetchUsers = useCallback(async (id) => {
        try {
            setLoading(true);
            const res = await baseApi.get(`/Users/GetUserInfo/${id}`);
            if (res) {
                setUser(res);
            }
        } catch (error) {
            console.error('Không có dữ liệu user', error);
            message.error('Không thể tải thông tin người dùng!');
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
            message.warn('Vui lòng đăng nhập để xem thông tin.');
        }
    }, [fetchUsers]);
    
    const renderContent = () => {
        if (loading) {
            return <Spin size="large" className="content-spinner" />;
        }
        if (!user) {
            return <div>Không tìm thấy thông tin người dùng.</div>
        }
        
        switch (selectedKey) {
            case 'profile':
                return <ProfileForm user={user} fetchUsers={fetchUsers} />;
            case 'address':
                return <AddressView />;
            case 'orders':
                return <OrderHistory />;
            default:
                return <ProfileForm user={user} fetchUsers={fetchUsers} />;
        }
    };

    return (
        <div className="profile-container">
            <Header />
            <div className="profile-page">
                <aside className="profile-sidebar">
                    <Menu
                        className="profile-menu"
                        onClick={(e) => setSelectedKey(e.key)}
                        style={{ width: 256, height: '100%' }}
                        selectedKeys={[selectedKey]}
                        mode="inline"
                        items={items}
                    />
                </aside>

                <main className="profile-content">
                    <div className="content-card">
                        {renderContent()}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}