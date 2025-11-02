import React, { useState, useEffect } from 'react';
import baseApi from '../../../api/baseApi';
import { 
    Form,
    Button,
    Input,
    Select,
    DatePicker,
    Modal,
    Space
} from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { showFormNotification } from '../../../utils/notification';
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
    const [passwordForm] = Form.useForm();
    const [updating, setUpdating] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const { t } = useTranslation();

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
                role: user.role,
            };

            await baseApi.put(
                `/Users/UpdateUser/${userId}`,
                payload
            );

            showFormNotification('success', t("profile.update.success"));
            fetchUsers(userId);

        } catch (error) {
            console.error("Cập nhật thất bại", error);
            const errorMessage = error.response?.data?.message || error.response?.message || t("profile.update.error");
            showFormNotification('error', t("profile.update.error"), errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordUpdate = async (values) => {
        setUpdatingPassword(true);
        try {
            const userId = localStorage.getItem("userId");
            
            await baseApi.put(
                `/Users/UpdatePassword/${userId}`,
                {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                }
            );

            showFormNotification('success', t("profile.password.update.success"));
            setPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            console.error("Cập nhật mật khẩu thất bại", error);
            const errorMessage = error.response?.data?.message || error.response?.message || t("profile.password.update.error");
            showFormNotification('error', t("profile.password.update.error"), errorMessage);
        } finally {
            setUpdatingPassword(false);
        }
    };

    return (
    <>
        <Form
            {...formItemLayout}
            form={form}
            name="profile_update"
            onFinish={onFinish}
            style={{ maxWidth: 700 }}
            scrollToFirstError
        >
            <Form.Item
                name="userName"
                label={t("profile.form.userName.label")}
                rules={[{ required: true, message: t("profile.form.userName.required"), whitespace: true }]}
            >
                <Input placeholder={t("profile.form.userName.placeholder")} />
            </Form.Item>

            <Form.Item
                name="fullName"
                label={t("profile.form.fullName.label")}
            >
                <Input placeholder={t("profile.form.fullName.placeholder")} />
            </Form.Item>

            <Form.Item
                name="email"
                label={t("profile.form.email.label")}
                rules={[
                    { type: "email", message: t("profile.form.email.invalid") },
                    { required: true, message: t("profile.form.email.required") }
                ]}
            >
                <Input disabled /> 
            </Form.Item>

            <Form.Item name="phone" label={t("profile.form.phone.label")}>
                <Input style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="dob" label={t("profile.form.dob.label")}>
                <DatePicker 
                    style={{ width: '100%' }} 
                    placeholder={t("profile.form.dob.placeholder")}
                />
            </Form.Item>

            <Form.Item name="gender" label={t("profile.form.gender.label")}>
                <Select
                    placeholder={t("profile.form.gender.placeholder")}
                    options={[
                        { value: 'male', label: t("profile.form.gender.male") },
                        { value: 'female', label: t("profile.form.gender.female") },
                        { value: 'other', label: t("profile.form.gender.other") },
                    ]}
                />
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Space>
                    <Button type="primary" htmlType="submit" loading={updating}>
                        {t("profile.update.button")}
                    </Button>
                    <Button 
                        icon={<LockOutlined />}
                        onClick={() => setPasswordModalVisible(true)}
                    >
                        {t("profile.password.update.button")}
                    </Button>
                </Space>
            </Form.Item>
        </Form>

        <Modal
            title={t("profile.password.update.title")}
            open={passwordModalVisible}
            onCancel={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
            }}
            footer={null}
            width={500}
        >
            <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordUpdate}
            >
                <Form.Item
                    name="currentPassword"
                    label={t("profile.password.form.currentPassword.label")}
                    rules={[
                        { required: true, message: t("profile.password.form.currentPassword.required") }
                    ]}
                >
                    <Input.Password placeholder={t("profile.password.form.currentPassword.placeholder")} />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label={t("profile.password.form.newPassword.label")}
                    rules={[
                        { required: true, message: t("profile.password.form.newPassword.required") },
                        { min: 6, message: t("profile.password.form.newPassword.minLength") }
                    ]}
                >
                    <Input.Password placeholder={t("profile.password.form.newPassword.placeholder")} />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label={t("profile.password.form.confirmPassword.label")}
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: t("profile.password.form.confirmPassword.required") },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t("profile.password.form.confirmPassword.notMatch")));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder={t("profile.password.form.confirmPassword.placeholder")} />
                </Form.Item>

                <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={() => {
                            setPasswordModalVisible(false);
                            passwordForm.resetFields();
                        }}>
                            {t("profile.password.update.cancel")}
                        </Button>
                        <Button type="primary" htmlType="submit" loading={updatingPassword}>
                            {t("profile.password.update.submit")}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    </>
    );
}