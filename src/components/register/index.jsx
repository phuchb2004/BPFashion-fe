import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Divider,
  notification,
  Typography,
  Select,
  Checkbox
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import axiosSystem from '../../api/axiosSystem';
import './style.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const openNotification = (type, message, description = '') => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const res = await axiosSystem.post('/Users/Register', {
        userName: values.userName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        fullName: values.fullName,
        phone: values.phone,
        role: values.role || 'Customer',
        address: values.address || '',
        gender: values.gender || 'Other',
        dob: values.dob ? new Date(values.dob).toISOString() : null
      });
      
      if (res) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.user.userId);
        localStorage.setItem("userName", res.user.userName);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("fullName", res.user.fullName);
        
        openNotification("success", "Đăng ký thành công!");
        navigate("/home-page");
      }
    } catch (error) {
      console.log('Đăng ký xảy ra lỗi', error);
      if (error.response && error.response.status === 409) {
        openNotification("error", "Đăng ký thất bại", error.response.message);
      } else if (error.response && error.response.data && error.response.message) {
        openNotification("error", "Đăng ký thất bại", error.response.message);
      } else {
        openNotification("error", "Đăng ký thất bại", "Vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '20px 0' }}>
        <Col xs={22} sm={18} md={14} lg={10} xl={8}>
          <Card className="register-card">
            <div className="register-header">
              <Title level={3} className="register-title">
                Đăng ký tài khoản
              </Title>
              <Text type="secondary">
                Tạo tài khoản để trải nghiệm đầy đủ các tính năng
              </Text>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={handleRegister}
              scrollToFirstError
              layout="vertical"
              className="register-form"
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập họ và tên!',
                  },
                ]}
              >
                <Input 
                  prefix={<UserOutlined className="site-form-item-icon" />} 
                  placeholder="Nhập họ và tên đầy đủ" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="userName"
                label="Tên đăng nhập"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên đăng nhập!',
                  },
                  {
                    min: 4,
                    message: 'Tên đăng nhập phải có ít nhất 4 ký tự!',
                  },
                ]}
              >
                <Input 
                  prefix={<UserOutlined className="site-form-item-icon" />} 
                  placeholder="Tên đăng nhập" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: 'email',
                    message: 'Email không hợp lệ!',
                  },
                  {
                    required: true,
                    message: 'Vui lòng nhập email!',
                  },
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="site-form-item-icon" />} 
                  placeholder="Email" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số điện thoại!',
                  },
                  {
                    pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                    message: 'Số điện thoại không hợp lệ!',
                  },
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined className="site-form-item-icon" />} 
                  placeholder="Số điện thoại" 
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu!',
                  },
                  {
                    min: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Mật khẩu"
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng xác nhận mật khẩu!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Xác nhận mật khẩu"
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Bạn cần chấp nhận điều khoản!')),
                  },
                ]}
              >
                <Checkbox>
                  Tôi đồng ý với <a href="#">điều khoản sử dụng</a> và <a href="#">chính sách bảo mật</a>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="register-form-button"
                  loading={loading}
                  block
                  size="large"
                >
                  Đăng ký
                </Button>
              </Form.Item>

              <div className="register-footer">
                <Text>Đã có tài khoản? </Text>
                <Link to="/login">Đăng nhập ngay!</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;