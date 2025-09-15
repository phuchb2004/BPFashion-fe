import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Button, notification, Spin, Select, Breadcrumb, Divider, Tabs, Card, Row, Col,
    InputNumber, Space, Rate, Tag, Image, List, Avatar, Typography, Statistic,
    Progress, Badge, Alert
    } from "antd";
import {
    ShoppingCartOutlined,
    HeartOutlined,
    ShareAltOutlined,
    HomeOutlined,
    ShopOutlined,
    EyeOutlined,
    DollarOutlined,
    SafetyCertificateOutlined,
    RocketOutlined,
    CheckCircleOutlined,
    StarFilled
    } from "@ant-design/icons";
import axiosSystem from "../../api/axiosSystem";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./style.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Meta } = Card;

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        fetchProductDetails();
        fetchRelatedProducts();
    }, [id]);

    const fetchProductDetails = async () => {
    try {
        setLoading(true);
        const response = await axiosSystem.get(`/Products/GetProductById/${id}`);

        if (response) {
            setProduct(response);

            if (response.productId.size) {
                const sizes = response.data.size.split(',').map(s => s.trim());
                if (sizes.length > 0) {
                    setSelectedSize(sizes[0]);
                }
            }
        } else {
            setProduct(null);
        }
    } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        api.error({
            message: "Lỗi",
            description: "Không thể tải thông tin sản phẩm"
        });
    } finally {
        setLoading(false);
    }
};

const fetchRelatedProducts = async () => {
    try {
        const response = await axiosSystem.get("/Products/GetAllProducts");

        const allProducts = Array.isArray(response) ? response : [];

        const filteredProducts = allProducts
            .filter(p => p.productId !== parseInt(id))
            .slice(0, 4);

        setRelatedProducts(filteredProducts);
    } catch (err) {
        console.error("Lỗi khi lấy sản phẩm liên quan:", err);
    }
};


    const handleAddToCart = async () => {
        try {
        setAddingToCart(true);
        const userId = localStorage.getItem("userId");
        if (!userId) {
            api.error({ 
            message: "Lỗi", 
            description: "Vui lòng đăng nhập trước khi mua hàng" 
            });
            navigate("/login");
            return;
        }

        await axiosSystem.post("/Cart/AddToCart", {
            userId: parseInt(userId),
            productId: product.productId,
            quantity: quantity
        });

        api.success({ 
            message: "Thành công", 
            description: "Đã thêm sản phẩm vào giỏ hàng" 
        });
        } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng", error);
        api.error({ 
            message: "Lỗi", 
            description: "Thêm sản phẩm vào giỏ hàng thất bại" 
        });
        } finally {
        setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            api.error({ 
            message: "Lỗi", 
            description: "Vui lòng đăng nhập trước khi mua hàng" 
            });
            navigate("/login");
            return;
        }

        await axiosSystem.post("/Cart/AddToCart", {
            userId: parseInt(userId),
            productId: product.productId,
            quantity: quantity
        });

        navigate("/checkout");
        } catch (error) {
        console.error("Lỗi khi mua hàng", error);
        api.error({ 
            message: "Lỗi", 
            description: "Không thể thực hiện mua hàng" 
        });
        }
    };

    const handleShareProduct = () => {
        if (navigator.share) {
        navigator.share({
            title: product.productName,
            text: product.description,
            url: window.location.href,
        })
        .catch(error => console.log('Lỗi chia sẻ:', error));
        } else {
        navigator.clipboard.writeText(window.location.href);
        api.success({ 
            message: "Thành công", 
            description: "Đã sao chép liên kết vào clipboard" 
        });
        }
    };

    if (loading) {
        return (
        <div className="loading-container">
            <Spin size="large" />
            <Text>Đang tải sản phẩm...</Text>
        </div>
        );
    }

    if (!product) {
        return (
        <div className="error-container">
            <Title level={2}>Không tìm thấy sản phẩm</Title>
            <Button type="primary" onClick={() => navigate("/")}>
                Quay lại trang chủ
            </Button>
        </div>
        );
    }

    const availableSizes = product.size ? product.size.split(',').map(s => s.trim()) : [];

    return (
        <>
        {contextHolder}
        <Header />
        
        <div className="product-detail-container">
            <Breadcrumb
            items={[
                { title: <HomeOutlined />, href: "/" },
                { title: 'Sản phẩm', href: '/products' },
                { title: product.CategoryName || 'Danh mục' },
                { title: product.productName },
            ]}
            style={{ marginBottom: 20 }}
            />

            <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
                <Card 
                cover={
                    <Image
                    src={product.imageUrl || "/placeholder-product.jpg"}
                    alt={product.productName}
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    placeholder={
                        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Spin size="large" />
                        </div>
                    }
                    />
                }
                actions={[
                    <EyeOutlined key="view" />,
                    <HeartOutlined key="like" />,
                    <ShareAltOutlined key="share" onClick={handleShareProduct} />,
                ]}
                >
                <Meta
                    title={product.productName}
                    description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary">Mã: {product.productId}</Text>
                        <Rate disabled defaultValue={4.5} allowHalf character={<StarFilled />} />
                    </Space>
                    }
                />
                </Card>
            </Col>

            <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Title level={2}>{product.productName}</Title>
                
                <Space>
                    <Statistic
                    title="Giá"
                    value={product.price}
                    precision={0}
                    prefix="₫"
                    valueStyle={{ color: '#cf1322' }}
                    />
                    {product.price > 100000 && (
                    <Text delete type="secondary" style={{ fontSize: '16px' }}>
                        ₫{(product.price * 1.2).toLocaleString()}
                    </Text>
                    )}
                </Space>

                <div>
                    <Text strong>Trạng thái: </Text>
                    {product.stockQuantity > 0 ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                        Còn hàng ({product.stockQuantity} sản phẩm)
                    </Tag>
                    ) : (
                    <Tag color="red">Hết hàng</Tag>
                    )}
                </div>

                {availableSizes.length > 0 && (
                    <div>
                    <Text strong>Kích thước: </Text>
                    <Select
                        value={selectedSize}
                        onChange={setSelectedSize}
                        style={{ width: 120, marginLeft: 8 }}
                    >
                        {availableSizes.map(size => (
                        <Option key={size} value={size}>{size}</Option>
                        ))}
                    </Select>
                    </div>
                )}

                <div>
                    <Text strong>Số lượng: </Text>
                    <InputNumber
                    min={1}
                    max={product.stockQuantity}
                    defaultValue={1}
                    value={quantity}
                    onChange={setQuantity}
                    style={{ width: 100, marginLeft: 8 }}
                    />
                </div>

                <Space>
                    <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    loading={addingToCart}
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    >
                    Thêm vào giỏ
                    </Button>
                    <Button
                    size="large"
                    style={{ background: '#ff4d4f', color: 'white' }}
                    onClick={handleBuyNow}
                    disabled={product.stockQuantity === 0}
                    >
                    Mua ngay
                    </Button>
                </Space>

                <Divider />

                <Alert
                    message="Thông tin giao hàng"
                    description={
                    <Space direction="vertical">
                        <Text>Miễn phí vận chuyển cho đơn hàng trên 500.000₫</Text>
                        <Text>Giao hàng toàn quốc trong 2-5 ngày</Text>
                    </Space>
                    }
                    type="info"
                    showIcon
                />

                <Row gutter={[16, 16]}>
                    <Col span={12}>
                    <Card size="small">
                        <Meta
                        avatar={<SafetyCertificateOutlined style={{ color: '#52c41a' }} />}
                        title="Bảo hành"
                        description="Đổi trả trong 30 ngày"
                        />
                    </Card>
                    </Col>
                    <Col span={12}>
                    <Card size="small">
                        <Meta
                        avatar={<RocketOutlined style={{ color: '#1890ff' }} />}
                        title="Vận chuyển"
                        description="Giao hàng nhanh"
                        />
                    </Card>
                    </Col>
                </Row>
                </Space>
            </Col>
            </Row>

            <Divider />
            <Card>
            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Mô tả sản phẩm" key="1">
                <Paragraph>{product.description}</Paragraph>
                {product.material && (
                    <div>
                    <Title level={5}>Chất liệu</Title>
                    <Text>{product.material}</Text>
                    </div>
                )}
                </TabPane>
                <TabPane tab="Thông tin bổ sung" key="2">
                <List
                    size="small"
                    dataSource={[
                    { label: 'Mã sản phẩm', value: product.productId },
                    { label: 'Thương hiệu', value: product.BrandName },
                    { label: 'Danh mục', value: product.CategoryName },
                    { label: 'Chất liệu', value: product.material },
                    { label: 'Kích thước', value: product.size },
                    ]}
                    renderItem={item => (
                    <List.Item>
                        <Text strong>{item.label}:</Text> {item.value || 'N/A'}
                    </List.Item>
                    )}
                />
                </TabPane>
                <TabPane tab="Đánh giá (0)" key="3">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Title level={4}>Chưa có đánh giá nào</Title>
                    <Text type="secondary">Hãy là người đầu tiên đánh giá sản phẩm này</Text>
                    <br />
                    <Button type="primary" style={{ marginTop: 16 }}>
                    Viết đánh giá
                    </Button>
                </div>
                </TabPane>
            </Tabs>
            </Card>

            {relatedProducts.length > 0 && (
            <>
                <Divider />
                <Title level={3}>Sản phẩm liên quan</Title>
                <Row gutter={[16, 16]}>
                {relatedProducts.map(item => (
                    <Col xs={12} sm={8} md={6} key={item.productId}>
                    <Card
                        hoverable
                        cover={
                        <Image
                            alt={item.productName}
                            src={item.imageUrl || "/placeholder-product.jpg"}
                            height={200}
                            style={{ objectFit: 'cover' }}
                            preview={false}
                        />
                        }
                        onClick={() => navigate(`/product/${item.productId}`)}
                    >
                        <Meta
                        title={item.productName}
                        description={
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text strong style={{ color: '#cf1322' }}>
                                ₫{item.price.toLocaleString()}
                            </Text>
                            {item.stockQuantity > 0 ? (
                                <Badge status="success" text="Còn hàng" />
                            ) : (
                                <Badge status="error" text="Hết hàng" />
                            )}
                            </Space>
                        }
                        />
                    </Card>
                    </Col>
                ))}
                </Row>
            </>
            )}
        </div>
        
        <Footer />
        </>
    );
}