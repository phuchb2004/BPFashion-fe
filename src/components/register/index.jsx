import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Form, Input, Button, Card, Row, Col, Divider,
  notification, Typography, Space, Layout, Image, Select
} from 'antd';
import {
  LockOutlined,
  MailOutlined,
  GoogleOutlined
} from '@ant-design/icons';
import axiosSystem from '../../api/axiosSystem';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import './style.css';
import imgOverlay from '../../assets/img-overlay2.jpg';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Option } = Select;

export default function Register() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/homepage");
    }
  }, [navigate]);

  const openNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "topRight",
      duration: 3
    });
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      };

      const res = await axiosSystem.post('/Users/Register', formattedValues);
      if (res && res.success) {
        openNotification("success", "Đăng ký thành công!", "Vui lòng đăng nhập để tiếp tục");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log('Đăng ký xảy ra lỗi', error);
      let errorMessage = "Đăng ký thất bại";
      
      if (error.response) {
        errorMessage = error.response.message || errorMessage;
      }
      
      openNotification("error", "Đăng ký thất bại", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user info", decoded);

      const res = await axiosSystem.post("/RegisterGoogle", {
        credential: credentialResponse.credential,
      });
      
      if (res) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("fullName", res.user.fullName);
        
        openNotification("success", "Đăng ký Google thành công!");
        navigate("/homepage");
      }
    } catch (error) {
      console.log("Google register error", error);
      openNotification("error", "Đăng ký Google thất bại", "Vui lòng thử lại");
    }
  };

  const handleGoogleFailure = () => {
    openNotification("error", "Đăng ký Google thất bại", "Không thể đăng ký bằng Google");
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng nhập mật khẩu!'));
    }
    
    if (value.length < 6) {
      return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
    }
    
    return Promise.resolve();
  };

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
    },
  });

  return (
    <Layout className="login-layout">
      {contextHolder}
      <Content className="login-content">
        <Row className="login-row">
          <Col xs={0} lg={12} xl={14} className="login-image-col">
            <div className="image-container">
              <Image
                src={imgOverlay}
                alt="Fashion Store"
                preview={false}
                className="login-image"
                width="100%"
                height="100%"
              />
              <div className="image-overlay">
                <div className="brand-content">
                  <Title level={1} className="brand-title-large">
                    {t("login.overlay.name")}
                  </Title>
                  <Paragraph className="brand-subtitle">
                    {t("login.overlay.slogan")}
                  </Paragraph>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} lg={12} xl={10} className="login-form-col">
            <div className="form-container">
              <Card className="login-card">
                <div className="login-card-header">
                  <Title level={2} className="login-title">
                    {t("register.title", "Đăng Ký")}
                  </Title>
                  <Paragraph className="login-subtitle">
                    {t("register.text.ifHaveAccount", "Đã có tài khoản?")} <Link to="/login">{t("register.text.loginNow", "Đăng nhập ngay")}</Link>
                  </Paragraph>
                </div>
                <Form
                  form={form}
                  name="register"
                  onFinish={handleRegister}
                  autoComplete="off"
                  layout="vertical"
                  size="large"
                  className="login-form"
                  scrollToFirstError
                >
                  <Form.Item
                    name="email"
                    label="Email"
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
                      prefix={<MailOutlined className="input-icon" />}
                      placeholder="Nhập địa chỉ email"
                      className="login-input"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                      {
                        validator: validatePassword,
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="input-icon" />}
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                      className="login-input"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng xác nhận mật khẩu!',
                      },
                      validateConfirmPassword,
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="input-icon" />}
                      placeholder="Nhập lại mật khẩu"
                      className="login-input"
                    />
                  </Form.Item>
                  <Form.Item className="login-button-item">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      loading={loading}
                      block
                    >
                      {t("register.button.register", "Đăng Ký")}
                    </Button>
                  </Form.Item>
                </Form>
                <Divider plain className="login-divider">
                  {t("register.text.orDivider")}
                </Divider>
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
                        {t("register.button.google")}
                      </Button>
                    )}
                  />
                </div>
                <div className="login-footer">
                  <Space direction="vertical" size="small" className="footer-links">
                    <Text type="secondary" className="footer-text">
                      {t("footer.copyright")}
                    </Text>
                  </Space>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}