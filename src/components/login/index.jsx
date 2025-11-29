import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Form, Input, Button, Card, Row, Col, Divider,
  notification, Typography, Space, Layout, Image
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined
} from '@ant-design/icons';
import baseApi from '../../api/baseApi';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import './style.css';

const imgOverlay = '/assets/img-overlay2.jpg';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

export default function Login() {
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
      duration: type === 'success' ? 3 : 4
    });
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await baseApi.post('/Users/Login', values);
      if (res) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.user.userId);
        localStorage.setItem("fullName", res.user.fullName);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("dob", res.user.dob);
        localStorage.setItem("gender", res.user.gender);
        localStorage.setItem("role", res.user.role);

        openNotification("success", "Đăng nhập thành công!", "Chào mừng bạn quay trở lại!");
        
        setTimeout(() => {
          if (res.user.role === "Admin") {
            navigate("/dashboard");
          } else {
            navigate("/homepage");
          }
        }, 2000);
      }
    } catch (error) {
      console.log('Đăng nhập xảy ra lỗi', error);
      const errorMsg = error.response?.data?.message || "Sai email hoặc mật khẩu";
      openNotification("error", "Đăng nhập thất bại", errorMsg);
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user info", decoded);

      const res = await baseApi.post("/LoginGoogle", {
        credential: credentialResponse.credential,
      });
      
      if (res) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("fullName", res.user.fullName);
        
        openNotification("success", "Đăng nhập Google thành công!", "Chào mừng bạn quay trở lại!");
        
        setTimeout(() => {
          navigate("/homepage");
        }, 500);
      }

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
                    {t("login.title")}
                  </Title>
                  <Paragraph className="login-subtitle">
                    {t("login.text.ifNoAccount")} <Link to="/register">{t("login.text.registerNow")}</Link>
                  </Paragraph>
                </div>
                
                <Form
                  form={form}
                  name="login"
                  onFinish={handleLogin}
                  autoComplete="off"
                  layout="vertical"
                  size="large"
                  className="login-form"
                >
                  <Form.Item
                    name="email"
                    label={t("login.email.label")}
                    rules={[
                      {
                        required: true,
                        message: t("login.email.required"),
                      },
                      {
                        type: 'email',
                        message: t("login.email.invalid"),
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="input-icon" />}
                      placeholder={t("login.email.placeholder")}
                      className="login-input"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={t("login.password.label")}
                    rules={[
                      {
                        required: true,
                        message: t("login.password.required"),
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="input-icon" />}
                      placeholder={t("login.password.placeholder")}
                      className="login-input"
                    />
                  </Form.Item>

                  <Form.Item className="login-button-item">
                    <Button
                      type="primary"
                      onClick={() => form.submit()}
                      className="login-form-button"
                      loading={loading}
                      block
                    >
                      {t("login.button.login")}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider plain className="login-divider">
                  {t("login.text.orDivider")}
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
                        {t("login.button.google")}
                      </Button>
                    )}
                  />
                </div>

                <div className="login-footer">
                  <Space direction="vertical" size="small" className="footer-links">
                    <Link to="/forgot-password" className="forgot-link">
                      {t("login.text.forgotPass")}
                    </Link>
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