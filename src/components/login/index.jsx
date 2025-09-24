import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Form, Input, Button, Card, Row, Col, Divider,
  notification, Typography, Space, Image, Layout
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined
} from '@ant-design/icons';
import axiosSystem from '../../api/axiosSystem';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import './style.css';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home-page");
    }
  }, [navigate]);

  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "topRight",
      duration: 2
    });
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axiosSystem.post('/Users/Login', values);

      console.log('response: ', res);
      
      if (res) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.user.userId);
        localStorage.setItem("fullName", res.user.fullName);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("password", res.user.password);
        localStorage.setItem("dob", res.user.dob);
        localStorage.setItem("gender", res.user.gender);
        localStorage.setItem("role", res.user.role);
        
        openNotification("success", "Đăng nhập thành công!");
        navigate("/home-page");
      }
    } catch (error) {
      console.log('Đăng nhập xảy ra lỗi', error);
      openNotification("error", "Đăng nhập thất bại", "Sai email hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user info", decoded);

      const res = await axiosSystem.post("/LoginGoogle", {
        credential: credentialResponse.credential,
      });
      
      if (res) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("fullName", res.user.fullName);
      }

      openNotification("success", "Đăng nhập Google thành công!");
      navigate("/home-page");
    } catch (error) {
      console.log("Google login error", error);
      openNotification("error", "Đăng nhập Google thất bại", "Vui lòng thử lại");
    }
  };

  const handleGoogleFailure = () => {
    openNotification("error", "Đăng nhập Google thất bại", "Không thể đăng nhập bằng Google");
  };

  return (
    <Layout className="login-layout">
      {contextHolder}
      <Content className="login-content">
        <Row justify="center" align="middle" className="login-row">
          <Col xs={22} sm={18} md={14} lg={12} xl={10}>
            <Card className="login-card">
              <div className="login-card-header">
                <Title level={2} className="login-title">
                  Đăng nhập
                </Title>
                <Paragraph>
                  Nếu chưa có tài khoản, <Link to="/register">đăng ký ngay</Link>
                </Paragraph>
              </div>

              <Form
                form={form}
                name="login"
                onFinish={handleLogin}
                autoComplete="off"
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập email!',
                    },
                    {
                      type: 'email',
                      message: 'Email không hợp lệ!',
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Email"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mật khẩu!',
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    loading={loading}
                    block
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>

              <Divider plain>Hoặc</Divider>

              <div className="social-login">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  render={(renderProps) => (
                    <Button
                      icon={<GoogleOutlined />}
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      block
                      size="large"
                      className="google-login-button"
                    >
                      Đăng nhập với Google
                    </Button>
                  )}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}