import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseApi from '../../../api/baseApi';
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import './style.css';
import { 
    UserOutlined,
    HomeOutlined,
    DropboxOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { 
    Menu,
    Card,
    Button,
    Form,
    Input,
    Select,
    Modal,
    Space,
    Tag,
    Empty,
    Popconfirm,
    Spin
} from 'antd';
import { showSuccess, showError, showFormNotification } from '../../../utils/notification';
const { Option } = Select;

const cities = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông'
];

export default function AddressManagement() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAddresses();
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchAddresses = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            showError('Vui lòng đăng nhập để xem địa chỉ.');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            try {
                const addressRes = await baseApi.get(`/Addresses/GetByUser/${userId}`);
                const addressList = addressRes?.data || addressRes?.addresses || addressRes || [];
                if (Array.isArray(addressList) && addressList.length > 0) {
                    setAddresses(addressList);
                    return;
                }
            } catch (addressError) {
                console.log('Không tìm thấy endpoint addresses riêng, thử lấy từ user info', addressError);
            }
            const res = await baseApi.get(`/Users/GetUserInfo/${userId}`);
            if (res) {
                if (res.addresses && Array.isArray(res.addresses)) {
                    setAddresses(res.addresses);
                } 
                else if (res.address && typeof res.address === 'string') {
                    setAddresses([{
                        id: 1,
                        address: res.address,
                        receiverName: res.fullName || '',
                        phone: res.phone || '',
                        isDefault: true
                    }]);
                } else {
                    setAddresses([]);
                }
            } else {
                setAddresses([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy địa chỉ:', error);
            const errorMsg = error.response?.data?.message || error.response?.message || 'Không thể tải danh sách địa chỉ!';
            showError('Không thể tải danh sách địa chỉ!', errorMsg);
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingAddress(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (address) => {
        setEditingAddress(address);
        form.setFieldsValue({
            address: address.address,
            city: address.city,
            district: address.district,
            ward: address.ward,
            phone: address.phone,
            receiverName: address.receiverName,
            isDefault: address.isDefault
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
            showSuccess('Xóa địa chỉ thành công!');
        } catch (error) {
            showError('Xóa địa chỉ thất bại!', error);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            setAddresses(prev => prev.map(addr => ({
                ...addr,
                isDefault: addr.id === id
            })));
            showSuccess('Đặt địa chỉ mặc định thành công!');
        } catch (error) {
            showError('Đặt địa chỉ mặc định thất bại!', error);
        }
    };

    const onFinish = async (values) => {
        try {
            const userId = localStorage.getItem("userId");
            const addressData = {
                ...values,
                userId: userId,
                isDefault: editingAddress ? values.isDefault : addresses.length === 0
            };

            if (editingAddress) {
                setAddresses(prev => prev.map(addr => 
                    addr.id === editingAddress.id ? { ...addr, ...addressData } : addr
                ));
                showFormNotification('success', 'Cập nhật địa chỉ thành công!');
            } else {
                const newAddress = { id: Date.now(), ...addressData };
                setAddresses(prev => [...prev, newAddress]);
                showFormNotification('success', 'Thêm địa chỉ thành công!');
            }

            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            const errorMsg = error.response?.data?.message || (editingAddress ? 'Cập nhật thất bại!' : 'Thêm địa chỉ thất bại!');
            showFormNotification('error', editingAddress ? 'Cập nhật thất bại!' : 'Thêm địa chỉ thất bại!', errorMsg);
        }
    };

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
                            selectedKeys={['address']}
                            mode="inline"
                            items={menuItems}
                            className="profile-menu"
                        />
                    </Card>
                </aside>

                <main className="profile-content">
                    <Card className="content-card">
                        <div className="address-header">
                            <h2 className="page-title">Quản lý địa chỉ</h2>
                            <Button 
                                type="primary" 
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                className="add-button"
                            >
                                Thêm địa chỉ mới
                            </Button>
                        </div>

                        {loading ? (
                            <div className="loading-wrapper">
                                <Spin size="large" />
                            </div>
                        ) : addresses.length === 0 ? (
                            <Empty description="Chưa có địa chỉ nào" />
                        ) : (
                            <div className="address-list">
                                {addresses.map((address) => (
                                    <Card 
                                        key={address.id} 
                                        className={`address-card ${address.isDefault ? 'default-address' : ''}`}
                                    >
                                        <div className="address-card-header">
                                            <Space>
                                                <Tag color={address.isDefault ? "success" : "default"}>
                                                    {address.isDefault && <CheckCircleOutlined />} {address.isDefault ? 'Mặc định' : 'Địa chỉ'}
                                                </Tag>
                                                {address.receiverName && (
                                                    <span className="receiver-name">{address.receiverName}</span>
                                                )}
                                            </Space>
                                            <Space>
                                                {!address.isDefault && (
                                                    <Button 
                                                        type="link" 
                                                        size="small"
                                                        onClick={() => handleSetDefault(address.id)}
                                                    >
                                                        Đặt mặc định
                                                    </Button>
                                                )}
                                                <Button 
                                                    type="link" 
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEdit(address)}
                                                >
                                                    Sửa
                                                </Button>
                                                <Popconfirm
                                                    title="Bạn có chắc muốn xóa địa chỉ này?"
                                                    onConfirm={() => handleDelete(address.id)}
                                                    okText="Xóa"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ 
                                                        size: 'middle',
                                                        danger: true 
                                                    }}
                                                    cancelButtonProps={{ 
                                                        size: 'middle' 
                                                    }}
                                                >
                                                    <Button 
                                                        type="link" 
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Popconfirm>
                                            </Space>
                                        </div>
                                        <div className="address-details">
                                            <p>{address.address}</p>
                                            {address.ward && <p>{address.ward}, {address.district}, {address.city}</p>}
                                            {address.phone && <p>Điện thoại: {address.phone}</p>}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card>
                </main>
            </div>

            <Modal
                title={editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="receiverName"
                        label="Tên người nhận"
                        rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}
                    >
                        <Input placeholder="Nhập tên người nhận" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label="Tỉnh/Thành phố"
                        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
                    >
                        <Select placeholder="Chọn tỉnh/thành phố" showSearch filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }>
                            {cities.map(city => (
                                <Option key={city} value={city}>{city}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ward"
                        label="Phường/Xã/Thị trấn"
                        rules={[{ required: true, message: 'Vui lòng nhập phường/xã/thị trấn!' }]}
                    >
                        <Input placeholder="Nhập phường/xã/thị trấn" />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Địa chỉ chi tiết"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}
                    >
                        <Input.TextArea 
                            rows={3} 
                            placeholder="Nhập số nhà, tên đường, tên khu vực..."
                        />
                    </Form.Item>

                    <Form.Item name="isDefault" valuePropName="checked">
                        <Space>
                            <input type="checkbox" />
                            <span>Đặt làm địa chỉ mặc định</span>
                        </Space>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingAddress ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                            <Button onClick={() => {
                                setIsModalVisible(false);
                                form.resetFields();
                            }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Footer />
        </div>
    );
}

