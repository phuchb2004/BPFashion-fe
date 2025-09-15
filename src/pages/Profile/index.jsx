import React, { useState, useEffect } from 'react';
import axiosSystem from '../../api/axiosSystem';
import './style.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
    UserOutlined,
    HeartOutlined,
    HomeOutlined,
    DropboxOutlined
} from '@ant-design/icons';
import { 
    Menu,
    Form,
    Button,
    Input,
    Select,
} from 'antd';

const items = [
    { key: 'profile', icon: <UserOutlined/>, label: 'Tài khoản' },
    { key: 'address', icon: <HomeOutlined />, label: 'Địa chỉ'},
    { key: 'orders', icon: <DropboxOutlined />, label: 'Quản lý đơn hàng' }
]

export default function Profile() {
    const [user, setUser] = useState(null);
    const [selectedKey, setSelectedKey] = useState("profile");
    const [form] = Form.useForm();

    const fetchUsers = async (id) => {
        try {
            const res = await axiosSystem.get(`/Users/GetUserInfo/${id}`);
            if (res) {
                setUser(res);
                form.setFieldsValue(res);
            }
        } catch (error) {
            console.log('Không có dữ liệu user', error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetchUsers(userId);
        }
    }, []);

    const onFinish = async (values) => {
        try {
            const userId = localStorage.getItem("userId");

            const payload = {
            userName: values.userName,
            email: values.email,
            password: values.password,
            phone: values.phone,
            gender: values.gender,
            fullName: values.fullName || null,
            dob: values.dob || null,
            address: values.address || null,
            role: user.role || "user"
            };

            const res = await axiosSystem.put(
            `/Users/UpdateUser/${userId}`,
            JSON.stringify(payload),
            {
                headers: {
                "Content-Type": "application/json"
                }
            }
            );

            if (res.status === 200) {
            alert("Cập nhật thành công!");
            }
        } 
        catch (error) {
            console.error("Cập nhật thất bại", error);
            alert("Cập nhật thất bại!");
        }
    };

    if (!user) {
        return <div className="loading">Loading...</div>
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
            span: 24,
            offset: 0,
            },
            sm: {
            span: 16,
            offset: 8,
            },
        },
    };

    return (
        <div className="profile-container">
            <Header />

            <div className="profile-page">
                <aside className="profile-sidebar">
                    <Menu
                        onClick={(e) => setSelectedKey(e.key)}
                        style={{ width: 256 }}
                        selectedKeys={[selectedKey]}
                        mode="inline"
                        items={items}
                    />
                </aside>

                <section className="profile-content">
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        style={{ maxWidth: 600 }}
                        scrollToFirstError
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="userName"
                            label="Tên người dùng"
                            tooltip="Bạn muốn chúng tôi gọi bạn là gì?"
                            rules={[{ message: 'Tên người dùng không được để trống!', whitespace: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: "email",
                                    message: "Vui lòng nhập email đúng định dạng"
                                },
                                {
                                    required: true,
                                    message: "Email không được để trống"
                                }
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                {
                                    required: true,
                                    message: "Mật khẩu không được để trống"
                                }
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            label="Gender"
                        >
                            <Select placeholder="Chọn giới tính">
                            <Option value="male">Nam</Option>
                            <Option value="female">Nữ</Option>
                            <Option value="other">Khác</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>

            <Footer />
        </div>
    );
}
