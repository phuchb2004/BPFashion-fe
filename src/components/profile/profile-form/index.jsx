import React, { useState, useEffect } from 'react';
import axiosSystem from '../../../api/axiosSystem';
import { 
    Form,
    Button,
    Input,
    Select,
    DatePicker,
    message
} from 'antd';
import moment from 'moment';

const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 18 } },
};

const tailFormItemLayout = {
    wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 18, offset: 6 } },
};

export default function ProfileForm({ user, fetchUsers }) {
    const [form] = Form.useForm();
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user,
                dob: user.dob ? moment(user.dob) : null,
            });
        }
    }, [user, form]);
    
    const onFinish = async (values) => {
        setUpdating(true);
        try {
            const userId = localStorage.getItem("userId");
            
            const payload = {
                userName: values.userName,
                email: values.email,
                phone: values.phone,
                gender: values.gender,
                fullName: values.fullName || null,
                dob: values.dob ? values.dob.toISOString() : null, 
                address: values.address || null,
                role: user.role,
            };

            if (values.password) {
                payload.password = values.password;
            }

            await axiosSystem.put(
                `/Users/UpdateUser/${userId}`,
                payload
            );

            message.success("Cập nhật thành công!");
            fetchUsers(userId);

        } catch (error) {
            console.error("Cập nhật thất bại", error);
            const errorMessage = error.response?.message || "Cập nhật thất bại!";
            message.error(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="profile_update"
            onFinish={onFinish}
            style={{ maxWidth: 700 }}
            scrollToFirstError
        >
            <h2 className="form-title">Thông tin cá nhân</h2>
            <Form.Item
                name="userName"
                label="Tên người dùng"
                rules={[{ required: true, message: 'Tên người dùng không được để trống!', whitespace: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="fullName"
                label="Họ và tên"
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="E-mail"
                rules={[
                    { type: "email", message: "Vui lòng nhập email đúng định dạng" },
                    { required: true, message: "Email không được để trống" }
                ]}
            >
                <Input disabled /> 
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu mới"
                tooltip="Để trống nếu bạn không muốn thay đổi mật khẩu"
                rules={[{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}
            >
                <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item name="phone" label="Số điện thoại">
                <Input style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item name="address" label="Địa chỉ">
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
            </Form.Item>

            <Form.Item name="dob" label="Ngày sinh">
                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
            </Form.Item>

            <Form.Item name="gender" label="Giới tính">
                <Select
                    placeholder="Chọn giới tính"
                    options={[
                        { value: 'male', label: 'Nam' },
                        { value: 'female', label: 'Nữ' },
                        { value: 'other', label: 'Khác' },
                    ]}
                />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={updating}>
                    Cập nhật
                </Button>
            </Form.Item>
        </Form>
    );
}