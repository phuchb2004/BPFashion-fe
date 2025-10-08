import React, { useState, useEffect } from 'react';
import {
  Button, Space, Modal, Form, Input, Select, DatePicker,
  message, Tag, Card, Spin, Popconfirm, Table
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosSystem from '../../../api/axiosSystem';
import moment from 'moment';
import cities from '../../../data/cities.json';
import { useTranslation } from 'react-i18next';
import '../common/style.css';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosSystem.get('/Users/GetAllUser');
      setUsers(res.users);
    } catch (error) {
      message.error('Lấy dữ liệu nhân viên thất bại!', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      dob: record.dob ? moment(record.dob) : null
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosSystem.delete(`/Users/DeleteUser/${id}`);
      message.success('Xóa thành công!');
      fetchUsers();
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Xóa thất bại');
      }
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      };

      if (editingUser) {
        await axiosSystem.put(`/Users/UpdateUser/${editingUser.userId}`, payload);
        message.success('Cập nhật thành công');
      } else {
        await axiosSystem.post('/Users/CreateUser', payload);
        message.success('Thêm thành công');
      }

      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Lưu thất bại');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

    const columns = [
    { title: t("dashboard.user.table.id"), dataIndex: 'userId', key: 'userId', render: (id) => `BPF${id}` },
    { title: t("dashboard.user.table.fullName"), dataIndex: 'fullName', key: 'fullName' },
    { title: t("dashboard.user.table.email"), dataIndex: 'email', key: 'email' },
    { title: t("dashboard.user.table.phone"), dataIndex: 'phone', key: 'phone', render: (phone) => phone || '-' },
    {
      title: t("dashboard.user.table.role"),
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          Admin: { color: 'red', text: 'Quản trị' },
          Manager: { color: 'orange', text: 'Quản lý' },
          User: { color: 'blue', text: 'Nhân viên' },
        };
        const { color, text } = roleMap[role] || { color: 'default', text: role };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: t("dashboard.user.table.action"),
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xóa nhân viên"
            description="Bạn có chắc chắn muốn xóa nhân viên này?"
            onConfirm={() => handleDelete(record.userId)}
            okText="Có" cancelText="Không" okType="danger"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className='dashboard-page-container'>
      <div className="dashboard-page-header">
        <h2>{t("dashboard.user.title")}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t("dashboard.user.button.add")}
        </Button>
      </div>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="userId"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingUser ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form 
          form={form} 
          layout="vertical"
          initialValues={{
            role: 'User',
            gender: 'Nam'
          }}
        >
          <Form.Item 
            name="userName" 
            label="Tên đăng nhập" 
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập' },
              { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item 
            name="fullName" 
            label="Họ và tên" 
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input placeholder="Nhập họ và tên đầy đủ" />
          </Form.Item>

          <Form.Item 
            name="email" 
            label="Email" 
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập địa chỉ email" />
          </Form.Item>

          <Form.Item 
            name="password" 
            label="Mật khẩu" 
            rules={[
              { 
                required: !editingUser, 
                message: 'Vui lòng nhập mật khẩu' 
              },
              { 
                min: 6, 
                message: 'Mật khẩu phải có ít nhất 6 ký tự' 
              }
            ]}
          >
            <Input.Password 
              placeholder={editingUser ? 'Để trống nếu không thay đổi' : 'Nhập mật khẩu'} 
            />
          </Form.Item>

          <Form.Item name="dob" label="Ngày sinh">
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              disabledDate={(current) => current && current > moment().endOf('day')}
            />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="phone" 
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9+\-() ]+$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Select placeholder="Chọn thành phố" showSearch>
              {cities.map(city => (
                <Option key={city.code} value={city.name}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="role" 
            label="Vai trò" 
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="Admin">Quản trị viên</Option>
              <Option value="User">Nhân viên</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;