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
import { useTranslation } from "react-i18next";

const logo = '/assets/logo-new.png';

const { Title, Paragraph, Text } = Typography;

export default function Footer() {
    const { t } = useTranslation();

    const supportLinks = [
        { text: t("footer.support.return"), href: "/return-policy" },
        { text: t("footer.support.private"), href: "/privacy-policy" },
        { text: t("footer.support.term"), href: "/terms-of-service" }
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
                                <Image src={logo} alt="Logo" preview={false} width={150} />
                                <Space direction="vertical" size="small">
                                    <Space>
                                        <PhoneOutlined />
                                        <Text>{t("footer.hotline")}</Text>
                                    </Space>
                                    <Space>
                                        <ClockCircleOutlined />
                                        <Text>{t("footer.open-time")}</Text>
                                    </Space>
                                </Space>
                                <Space direction="vertical" size="small" className="address">
                                    <Paragraph>
                                        <EnvironmentOutlined /> <b>VP Phía Bắc:</b> {t("footer.address.north")}
                                    </Paragraph>
                                    <Paragraph>
                                        <EnvironmentOutlined /> <b>VP Phía Nam:</b> {t("footer.address.south")}
                                    </Paragraph>
                                </Space>
                            </Space>
                        </Col>
                        <Col xs={24} md={8} lg={7}>
                            <div className="footer-column">
                                <Title level={4}>{t("footer.contact.title")}</Title>
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
                                <Title level={4}>{t("footer.news.title")}</Title>
                                <Space direction="vertical" className="newsletter" style={{ width: "100%" }}>
                                    <Input
                                        placeholder={t("footer.news.placeholder")}
                                        suffix={<SearchOutlined />}
                                    />
                                    <Button type="primary" block>
                                        {t("footer.news.button")}
                                    </Button>
                                </Space>
                            </div>
                        </Col>
                        <Col xs={24} md={8} lg={7}>
                            <div className="footer-column">
                                <Title level={4}>{t("footer.support.title")}</Title>
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
                                <Title level={4}>{t("footer.payment.title")}</Title>
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
                    {t("footer.copyright")}
                </Paragraph>
            </div>
        </footer>
    );
}
