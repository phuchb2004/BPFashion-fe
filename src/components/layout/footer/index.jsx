import React from "react";
import "./style.css";
import {
    Button,
    Input,
    Row,
    Col,
    Divider,
    Typography,
    Space,
    List,
    Image
} from "antd";
import {
    SearchOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

const { Title, Paragraph, Text } = Typography;

export default function Footer() {
    const supportLinks = [
        { text: "Chính sách đổi trả", href: "/return-policy" },
        { text: "Chính sách bảo mật", href: "/privacy-policy" },
        { text: "Điều khoản dịch vụ", href: "/terms-of-service" }
    ];

    const paymentMethods = [
        { src: "https://cdn-icons-png.flaticon.com/512/196/196578.png", alt: "Visa" },
        { src: "https://cdn-icons-png.flaticon.com/512/196/196561.png", alt: "Mastercard" },
        { src: "https://cdn-icons-png.flaticon.com/512/196/196565.png", alt: "PayPal" },
        { src: "https://cdn-icons-png.flaticon.com/512/196/196554.png", alt: "Momo" }
    ];

    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-container">
                    <Row gutter={[32, 32]} justify="space-between">
                        <Col xs={24} md={8} lg={7}>
                            <Space direction="vertical" className="footer-column" size="middle">
                                <Image src="/logo-new.png" alt="Logo" preview={false} width={150} />
                                <Space direction="vertical" size="small">
                                    <Space>
                                        <PhoneOutlined />
                                        <Text>Hotline: 1900 1000</Text>
                                    </Space>
                                    <Space>
                                        <ClockCircleOutlined />
                                        <Text>8:30 - 19:00 tất cả các ngày trong tuần</Text>
                                    </Space>
                                </Space>
                                <Space direction="vertical" size="small" className="address">
                                    <Paragraph>
                                        <EnvironmentOutlined /> <b>VP Phía Bắc:</b> Tầng 5 tòa nhà The Nine, số 9 Phạm Văn Đồng, Mai Dịch, Phú Diễn, Hà Nội
                                    </Paragraph>
                                    <Paragraph>
                                        <EnvironmentOutlined /> <b>VP Phía Nam:</b> Tầng 6 tòa nhà Landmark 81, Tân Cảng, Bình Thạnh, TP.HCM
                                    </Paragraph>
                                </Space>
                            </Space>
                        </Col>
                        <Col xs={24} md={8} lg={7}>
                            <div className="footer-column">
                                <Title level={4}>Thông tin liên hệ</Title>
                                <Space className="social-icons">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<FaFacebook size={18} />}
                                        href="https://www.facebook.com/react"
                                        target="_blank"
                                        size="large"
                                        className="facebook-btn"
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<FaInstagram size={18} />}
                                        href="https://www.instagram.com/reactjsofficial/?hl=en"
                                        target="_blank"
                                        size="large"
                                        className="instagram-btn"
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<FaXTwitter size={18} />}
                                        href="https://x.com/reactjs"
                                        target="_blank"
                                        size="large"
                                        className="x-btn"
                                    />
                                </Space>
                                <Divider />
                                <Title level={4}>Đăng ký nhận tin</Title>
                                <Space direction="vertical" className="newsletter" style={{ width: "100%" }}>
                                    <Input
                                        placeholder="Email của bạn"
                                        suffix={<SearchOutlined />}
                                    />
                                    <Button type="primary" block>
                                        Đăng ký
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                        <Col xs={24} md={8} lg={7}>
                            <div className="footer-column">
                                <Title level={4}>Hỗ trợ</Title>
                                <List
                                    size="small"
                                    dataSource={supportLinks}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <a href={item.href}>{item.text}</a>
                                        </List.Item>
                                    )}
                                />
                                <Divider />
                                <Title level={4}>Phương thức thanh toán</Title>
                                <Space wrap className="payment-methods">
                                    {paymentMethods.map((method, idx) => (
                                        <Image
                                            key={idx}
                                            src={method.src}
                                            alt={method.alt}
                                            preview={false}
                                            width={50}
                                            height={30}
                                            className="payment-icon"
                                        />
                                    ))}
                                </Space>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="footer-bottom">
                <Paragraph
                    style={{ color: 'white' }}
                >
                    © 2025 BP Fashion. All rights reserved.
                </Paragraph>
            </div>
        </footer>
    );
}
