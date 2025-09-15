import React, { useState, useEffect } from 'react';
import {
  Button, Space, Modal, Form, Input, Select, DatePicker,
  message, Tag, Card, Spin, Pagination
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosSystem from '../../../api/axiosSystem';
import moment from 'moment';
import './style.css';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 👉 State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // số bản ghi mỗi trang

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosSystem.get('/Users/GetAllUser');
      setUsers(response.user || []);
    } catch (error) {
      message.error('Lấy dữ liệu thất bại', error);
      setUsers([]);
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
      message.error('Xóa thất bại', error);
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
      message.error('Lưu thất bại', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 👉 Dữ liệu sau khi cắt phân trang
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="userTitle">
        <h2>Danh sách nhân viên</h2>
      </div>

      <div className="buttons">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="addButton"
        >
          Thêm nhân viên
        </Button>
      </div>

      <Card className="tableUsers">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Không tìm thấy nhân sự nào...
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Số điện thoại</th>
                  <th>Chức vụ</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.dob
                        ? new Date(user.dob).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                    <td>{user.gender}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Tag color={user.role === 'Admin' ? 'red' : 'blue'}>
                        {user.role}
                      </Tag>
                    </td>
                    <td>
                      <Space size="middle" className="actionButtons">
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(user)}
                          className="actionButton edit"
                        />
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(user.userId)}
                          className="actionButton delete"
                        />
                      </Space>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={users.length}
                onChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}
      </Card>

      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="userName" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: !editingUser }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item name="dob" label="Date of Birth">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="phone" label="Phone Number">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Option value="Admin">Admin</Option>
              <Option value="User">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
