import React, { useState, useEffect } from 'react';
import {
  Form, Input,
  Button,
  Card,
  Row,
  Col,
  List,
  Divider,
  Select,
  Typography,
  message,
  Spin,
  Steps,
  Radio,
  Space,
  Image
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './style.css'; // Tạo file CSS riêng

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

export default function Checkout() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [orderSummary, setOrderSummary] = useState({
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0
    });

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
        setLoading(true);
        // Giả lập dữ liệu giỏ hàng
        const mockCartItems = [
            { 
            cartitemid: 1, 
            productid: 101, 
            name: 'Áo thun nam chất liệu cotton', 
            price: 250000, 
            quantity: 2,
            image: 'https://via.placeholder.com/80x80'
            },
            { 
            cartitemid: 2, 
            productid: 102, 
            name: 'Quần jeans slim fit', 
            price: 450000, 
            quantity: 1,
            image: 'https://via.placeholder.com/80x80'
            }
        ];
        
        setCartItems(mockCartItems);
        
        // Tính tổng
        const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 1000000 ? 0 : 30000;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;
        
        setOrderSummary({
            subtotal,
            shipping,
            tax,
            total
        });
        } catch (error) {
        message.error('Lỗi khi tải giỏ hàng', error);
        } finally {
        setLoading(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
        // Gọi API checkout
        const response = await fetch('/checkout/Checkout', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            userId: 1, // Lấy từ authentication
            shippingAddress: values.shippingAddress,
            paymentMethod: values.paymentMethod,
            CartItems: cartItems.map(item => ({
                productId: item.productid,
                quantity: item.quantity,
                priceAtPurchase: item.price
            }))
            }),
        });

        if (response.ok) {
            const orderData = await response.json();
            message.success('Đặt hàng thành công!');
            navigate(`/order-confirmation/${orderData.orderId}`);
        } else {
            message.error('Có lỗi xảy ra khi đặt hàng');
        }
        } catch (error) {
        message.error('Lỗi kết nối', error);
        } finally {
        setLoading(false);
        }
    };

    const steps = [
        {
        title: 'Thông tin giao hàng',
        icon: <UserOutlined />,
        },
        {
        title: 'Thanh toán',
        icon: <CreditCardOutlined />,
        },
        {
        title: 'Hoàn tất',
        icon: <CheckCircleOutlined />,
        },
    ];

    return (
        <div className="checkout-container">
            <Header/>
            <div className="checkout-header">
                <div className="container">
                <Title level={2} className="checkout-title">Thanh toán</Title>
                </div>
            </div>
        
            <div className="container">
                <Steps current={currentStep} className="checkout-steps">
                {steps.map(item => (
                    <Step key={item.title} title={item.title} icon={item.icon} />
                ))}
                </Steps>
                
                <Row gutter={[24, 24]} className="checkout-content">
                <Col xs={24} lg={14}>
                    <Card className="checkout-form-card">
                    {currentStep === 0 && (
                        <>
                        <div className="section-title">
                            <UserOutlined className="section-icon" />
                            <span>Thông tin giao hàng</span>
                        </div>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                            paymentMethod: 'cod',
                            }}
                            className="checkout-form"
                        >
                            <Row gutter={16}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                name="firstName"
                                label="Họ"
                                rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                                >
                                <Input size="large" placeholder="Nhập họ" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                name="lastName"
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                                >
                                <Input size="large" placeholder="Nhập tên" />
                                </Form.Item>
                            </Col>
                            </Row>
                            
                            <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ' }
                            ]}
                            >
                            <Input 
                                size="large" 
                                placeholder="Nhập email" 
                                prefix={<MailOutlined />}
                            />
                            </Form.Item>
                            
                            <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                            <Input 
                                size="large" 
                                placeholder="Nhập số điện thoại" 
                                prefix={<PhoneOutlined />}
                            />
                            </Form.Item>
                            
                            <Form.Item
                            name="shippingAddress"
                            label="Địa chỉ giao hàng"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng' }]}
                            >
                            <Input.TextArea 
                                rows={3} 
                                placeholder="Nhập địa chỉ giao hàng đầy đủ" 
                                prefix={<HomeOutlined />}
                            />
                            </Form.Item>
                            
                            <Form.Item
                            name="city"
                            label="Thành phố"
                            rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
                            >
                            <Select size="large" placeholder="Chọn thành phố">
                                <Option value="hanoi">Hà Nội</Option>
                                <Option value="hcm">TP. Hồ Chí Minh</Option>
                                <Option value="danang">Đà Nẵng</Option>
                                <Option value="cantho">Cần Thơ</Option>
                                <Option value="haiphong">Hải Phòng</Option>
                            </Select>
                            </Form.Item>
                            
                            <Form.Item>
                            <Button 
                                type="primary" 
                                size="large" 
                                onClick={() => setCurrentStep(1)}
                                className="checkout-next-btn"
                            >
                                Tiếp tục đến thanh toán
                            </Button>
                            </Form.Item>
                        </Form>
                        </>
                    )}
                    
                    {currentStep === 1 && (
                        <>
                        <div className="section-title">
                            <CreditCardOutlined className="section-icon" />
                            <span>Phương thức thanh toán</span>
                        </div>
                        <Form form={form} layout="vertical" className="checkout-form">
                            <Form.Item name="paymentMethod">
                            <Radio.Group className="payment-options">
                                <Space direction="vertical" style={{ width: '100%' }}>
                                <Radio value="cod" className="payment-option">
                                    <div className="payment-method">
                                    <div className="payment-info">
                                        <div className="payment-name">Thanh toán khi nhận hàng (COD)</div>
                                        <div className="payment-desc">Bạn chỉ phải thanh toán khi nhận được hàng</div>
                                    </div>
                                    </div>
                                </Radio>
                                <Radio value="bank" className="payment-option">
                                    <div className="payment-method">
                                    <div className="payment-info">
                                        <div className="payment-name">Chuyển khoản ngân hàng</div>
                                        <div className="payment-desc">Chuyển khoản qua tài khoản ngân hàng</div>
                                    </div>
                                    </div>
                                </Radio>
                                <Radio value="momo" className="payment-option">
                                    <div className="payment-method">
                                    <div className="payment-info">
                                        <div className="payment-name">Ví MoMo</div>
                                        <div className="payment-desc">Thanh toán qua ứng dụng MoMo</div>
                                    </div>
                                    </div>
                                </Radio>
                                <Radio value="card" className="payment-option">
                                    <div className="payment-method">
                                    <div className="payment-info">
                                        <div className="payment-name">Thẻ tín dụng/ghi nợ</div>
                                        <div className="payment-desc">Thanh toán bằng thẻ Visa, MasterCard</div>
                                    </div>
                                    </div>
                                </Radio>
                                </Space>
                            </Radio.Group>
                            </Form.Item>
                            
                            <div className="checkout-actions">
                            <Button 
                                icon={<ArrowLeftOutlined />} 
                                onClick={() => setCurrentStep(0)}
                                className="checkout-back-btn"
                            >
                                Quay lại
                            </Button>
                            <Button 
                                type="primary" 
                                size="large" 
                                onClick={() => setCurrentStep(2)}
                                className="checkout-next-btn"
                            >
                                Tiếp tục đến xác nhận
                            </Button>
                            </div>
                        </Form>
                        </>
                    )}
                    
                    {currentStep === 2 && (
                        <>
                        <div className="section-title">
                            <CheckCircleOutlined className="section-icon" />
                            <span>Xác nhận đơn hàng</span>
                        </div>
                        <div className="confirmation-section">
                            <div className="confirmation-block">
                            <div className="confirmation-title">Thông tin giao hàng</div>
                            <div className="confirmation-content">
                                <p><strong>{form.getFieldValue('firstName')} {form.getFieldValue('lastName')}</strong></p>
                                <p>{form.getFieldValue('shippingAddress')}</p>
                                <p>{form.getFieldValue('phone')}</p>
                                <p>{form.getFieldValue('email')}</p>
                            </div>
                            </div>
                            
                            <Divider />
                            
                            <div className="confirmation-block">
                            <div className="confirmation-title">Phương thức thanh toán</div>
                            <div className="confirmation-content">
                                <p>
                                {form.getFieldValue('paymentMethod') === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                                {form.getFieldValue('paymentMethod') === 'bank' && 'Chuyển khoản ngân hàng'}
                                {form.getFieldValue('paymentMethod') === 'momo' && 'Ví MoMo'}
                                {form.getFieldValue('paymentMethod') === 'card' && 'Thẻ tín dụng/ghi nợ'}
                                </p>
                            </div>
                            </div>
                            
                            <div className="checkout-actions">
                            <Button 
                                icon={<ArrowLeftOutlined />} 
                                onClick={() => setCurrentStep(1)}
                                className="checkout-back-btn"
                            >
                                Quay lại
                            </Button>
                            <Button 
                                type="primary" 
                                size="large" 
                                onClick={() => form.submit()}
                                loading={loading}
                                className="checkout-submit-btn"
                            >
                                Hoàn tất đặt hàng
                            </Button>
                            </div>
                        </div>
                        </>
                    )}
                    </Card>
                </Col>
                
                <Col xs={24} lg={10}>
                    <Card className="order-summary-card">
                    <div className="order-summary-title">Đơn hàng của bạn</div>
                    <div className="order-items">
                        {cartItems.map(item => (
                        <div key={item.cartitemid} className="order-item">
                            {/* <Image
                            width={80}
                            height={80}
                            src={item.image}
                            alt={item.name}
                            preview={false}
                            className="product-image"
                            /> */}
                            <div className="product-info">
                            <div className="product-name">{item.name}</div>
                            <div className="product-quantity">Số lượng: {item.quantity}</div>
                            </div>
                            <div className="product-price">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </div>
                        </div>
                        ))}
                    </div>
                    
                    <Divider className="summary-divider" />
                    
                    <div className="order-summary">
                        <div className="summary-row">
                        <span>Tạm tính:</span>
                        <span>{orderSummary.subtotal.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="summary-row">
                        <span>Phí vận chuyển:</span>
                        <span>{orderSummary.shipping.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="summary-row">
                        <span>Thuế (10%):</span>
                        <span>{orderSummary.tax.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <Divider className="summary-divider" />
                        <div className="summary-row total">
                        <span>Tổng cộng:</span>
                        <span>{orderSummary.total.toLocaleString('vi-VN')}₫</span>
                        </div>
                    </div>
                    </Card>
                </Col>
                </Row>
            </div>
            <Footer/>
        </div>
    );
}