import React, { useState, useEffect } from 'react';
import {
  Button, Space, Modal, Form, Input, Select, DatePicker,
  message, Tag, Card, Spin, Table, Dropdown
} from 'antd';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import baseApi from '../../../api/baseApi';
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
  const [viewUser, setViewUser] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await baseApi.get('/Users/GetAllUser');
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

  const handleDelete = async (id) => {
    try {
      await baseApi.delete(`/Users/DeleteUser/${id}`);
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
        await baseApi.put(`/Users/UpdateUser/${editingUser.userId}`, payload);
        message.success('Cập nhật thành công');
      } else {
        await baseApi.post('/Users/CreateUser', payload);
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

  const isEditing = (record) => record.userId === editingKey;

  const editInline = (record) => {
    form.setFieldsValue({
      fullName: '',
      email: '',
      phone: '',
      role: 'User',
      ...record,
    });
    setEditingKey(record.userId);
  };

  const cancelInline = () => {
    setEditingKey('');
  };

  const saveInline = async (userId) => {
    try {
      const row = await form.validateFields();
      const payload = {
        userName: undefined,
        password: undefined,
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        role: row.role,
        address: undefined,
        dob: undefined,
        gender: undefined
      };
      await baseApi.put(`/Users/UpdateUser/${userId}`, payload);
      message.success('Cập nhật thành công');
      setEditingKey('');
      fetchUsers();
    } catch {
      message.error('Cập nhật thất bại');
    }
  };

  const openView = (record) => {
    setViewUser(record);
    setViewOpen(true);
  };

  const confirmDelete = (id) => {
    Modal.confirm({
      title: 'Xóa nhân viên',
      content: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      okText: 'Có',
      cancelText: 'Không',
      okType: 'danger',
      onOk: () => handleDelete(id)
    });
  };

  const columns = [
    { title: t("dashboard.user.table.id"), dataIndex: 'userId', key: 'userId', render: (id) => `BPF${id}` },
    { 
      title: t("dashboard.user.table.fullName"), 
      dataIndex: 'fullName', 
      key: 'fullName',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="fullName"
            style={{ margin: 0 }}
            rules={[{ required: true, message: 'Nhập họ tên' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          text
        );
      }
    },
    { 
      title: t("dashboard.user.table.email"), 
      dataIndex: 'email', 
      key: 'email',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="email"
            style={{ margin: 0 }}
            rules={[{ type: 'email', required: true, message: 'Email không hợp lệ' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          text
        );
      }
    },
    { 
      title: t("dashboard.user.table.phone"), 
      dataIndex: 'phone', 
      key: 'phone', 
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="phone"
            style={{ margin: 0 }}
            rules={[{ pattern: /^[0-9+\-() ]*$/, message: 'Số điện thoại không hợp lệ' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          text || '-'
        );
      }
    },
    {
      title: t("dashboard.user.table.role"),
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => {
        const roleMap = {
          Admin: { color: 'red', text: 'Quản trị' },
          Manager: { color: 'orange', text: 'Quản lý' },
          User: { color: 'blue', text: 'Nhân viên' },
        };
        const editable = isEditing(record);
        if (editable) {
          return (
            <Form.Item name="role" style={{ margin: 0 }}>
              <Select style={{ width: 130 }}>
                <Option value="Admin">Quản trị</Option>
                <Option value="User">Nhân viên</Option>
              </Select>
            </Form.Item>
          );
        }
        const { color, text } = roleMap[role] || { color: 'default', text: role };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: t("dashboard.user.table.action"),
      key: 'action',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        if (editable) {
          return (
            <Space>
              <Button type="link" onClick={() => saveInline(record.userId)}>Lưu</Button>
              <Button type="link" onClick={cancelInline}>Hủy</Button>
            </Space>
          );
        }
        const items = [
          {
            key: 'view',
            label: 'Xem',
            onClick: () => openView(record)
          },
          {
            key: 'edit',
            label: 'Chỉnh sửa',
            onClick: () => editInline(record)
          },
          {
            key: 'delete',
            label: <span style={{ color: '#ff4d4f' }}>Xóa</span>,
            onClick: () => confirmDelete(record.userId)
          }
        ];
        return (
          <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
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
        <Form form={form} component={false}>
          <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            rowKey="userId"
            pagination={{ pageSize: 10 }}
          />
        </Form>
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

      <Modal
        title="Thông tin người dùng"
        open={viewOpen}
        footer={<Button onClick={() => setViewOpen(false)}>Đóng</Button>}
        onCancel={() => setViewOpen(false)}
        width={700}
        destroyOnClose
      >
        {viewUser && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p><strong>ID:</strong> {`BPF${viewUser.userId}`}</p>
              <p><strong>Họ tên:</strong> {viewUser.fullName}</p>
              <p><strong>Tên đăng nhập:</strong> {viewUser.userName || '-'}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Vai trò:</strong> {viewUser.role}</p>
            </div>
            <div>
              <p><strong>SĐT:</strong> {viewUser.phone || '-'}</p>
              <p><strong>Giới tính:</strong> {viewUser.gender || '-'}</p>
              <p><strong>Ngày tạo:</strong> {viewUser.createAt ? moment(viewUser.createAt).format('DD/MM/YYYY HH:mm') : '-'}</p>
              <p><strong>Ngày sinh:</strong> {viewUser.dob ? moment(viewUser.dob).format('DD/MM/YYYY') : '-'}</p>
              <p><strong>Địa chỉ:</strong> {viewUser.address || '-'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;