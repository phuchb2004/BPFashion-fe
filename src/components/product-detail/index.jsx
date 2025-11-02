import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Button, Spin, Select, Breadcrumb, Divider, Tabs, Card, Row, Col,
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
import baseApi from "../../api/baseApi";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { showSuccess, showError, showCartNotification } from "../../utils/notification";
import getProductImageUrl from "../../utils/productImageHelper";
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

    useEffect(() => {
        fetchProductDetails();
        fetchRelatedProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await baseApi.get(`/Products/GetProductById/${id}`);

            // Handle new API response format from GetProductById
            // Response includes: productId, productName, description, imageUrl, material, CategoryName, Variants
            const productData = response?.data || response?.product || response;
            
            if (productData) {
                // Process Variants to get available sizes and prices
                if (productData.Variants && productData.Variants.length > 0) {
                    const availableSizes = [...new Set(productData.Variants.map(v => v.SizeName || v.sizeName).filter(Boolean))];
                    const minPrice = Math.min(...productData.Variants.map(v => v.price || 0));
                    const totalStock = productData.Variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);

                    // Update product data with processed information
                    productData.price = minPrice;
                    productData.stockQuantity = totalStock;
                    productData.sizes = availableSizes;
                    productData.size = availableSizes.join(', ');
                    
                    // Set default size if available
                    if (availableSizes.length > 0) {
                        setSelectedSize(availableSizes[0]);
                    }
                }

                setProduct(productData);
            } else {
                setProduct(null);
            }
        } catch (err) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
            const errorMsg = err.response?.data?.message || "Không thể tải thông tin sản phẩm";
            showError("Lỗi", errorMsg);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async () => {
        try {
            const response = await baseApi.get("/Products/GetAllProducts");

            // Handle different response formats
            const allProducts = Array.isArray(response) 
                ? response 
                : Array.isArray(response?.data) 
                    ? response.data 
                    : Array.isArray(response?.products)
                        ? response.products
                        : [];

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
            showError("Vui lòng đăng nhập", "Vui lòng đăng nhập trước khi mua hàng");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        // Find variant based on selected size
        let variantId = null;
        if (product.Variants && product.Variants.length > 0) {
            if (selectedSize) {
                // Find variant matching selected size
                const variant = product.Variants.find(v => 
                    (v.SizeName || v.sizeName) === selectedSize
                );
                variantId = variant?.variantId;
            }
            
            // If no variant found or no size selected, use first available variant
            if (!variantId && product.Variants.length > 0) {
                variantId = product.Variants[0].variantId;
            }
        }

        if (!variantId) {
            showError("Lỗi", "Không tìm thấy biến thể sản phẩm. Vui lòng chọn kích thước.");
            return;
        }

        await baseApi.post("/Cart/AddToCart", {
            userId: parseInt(userId),
            variantId: variantId,
            quantity: quantity
        });

        showCartNotification("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
        
        // Refresh cart in header
        window.dispatchEvent(new Event('cartUpdated'));
        
        } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng", error);
        const errorMsg = error.response?.data?.message || "Thêm sản phẩm vào giỏ hàng thất bại";
        showError("Lỗi", errorMsg);
        } finally {
        setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            showError("Vui lòng đăng nhập", "Vui lòng đăng nhập trước khi mua hàng");
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        // Find variant based on selected size
        let variantId = null;
        if (product.Variants && product.Variants.length > 0) {
            if (selectedSize) {
                const variant = product.Variants.find(v => 
                    (v.SizeName || v.sizeName) === selectedSize
                );
                variantId = variant?.variantId;
            }
            
            if (!variantId && product.Variants.length > 0) {
                variantId = product.Variants[0].variantId;
            }
        }

        if (!variantId) {
            showError("Lỗi", "Không tìm thấy biến thể sản phẩm. Vui lòng chọn kích thước.");
            return;
        }

        await baseApi.post("/Cart/AddToCart", {
            userId: parseInt(userId),
            variantId: variantId,
            quantity: quantity
        });

        navigate("/checkout");
        } catch (error) {
        console.error("Lỗi khi mua hàng", error);
        const errorMsg = error.response?.data?.message || "Không thể thực hiện mua hàng";
        showError("Lỗi", errorMsg);
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
        showSuccess("Thành công", "Đã sao chép liên kết vào clipboard");
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

    const availableSizes = product.size 
        ? (typeof product.size === 'string' 
            ? product.size.split(',').map(s => s.trim()).filter(s => s)
            : Array.isArray(product.size) 
                ? product.size 
                : [])
        : [];

    return (
        <>
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
                    src={getProductImageUrl(product)}
                    alt={product.productName}
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    placeholder={
                        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Spin size="large" />
                        </div>
                    }
                    fallback="/assets/placeholder-product.jpg"
                    />
                }
                actions={[
                    <EyeOutlined key="view" />,
                    <HeartOutlined key="like" />,
                    <ShareAltOutlined key="share" onClick={handleShareProduct} />,
                ]}
                >
                <Meta
                    title={product.productName || 'Tên sản phẩm'}
                    description={
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text type="secondary">Mã sản phẩm: {product.productId}</Text>
                        <Rate disabled defaultValue={4.5} allowHalf character={<StarFilled />} />
                        {product.CategoryName && (
                            <Tag color="blue">{product.CategoryName}</Tag>
                        )}
                    </Space>
                    }
                />
                </Card>
            </Col>

            <Col xs={24} md={12}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Title level={2}>{product.productName || 'Tên sản phẩm'}</Title>
                
                <Space align="baseline" size="large">
                    {product.discount && product.discount > 0 ? (
                        <>
                            <Statistic
                                title="Giá khuyến mãi"
                                value={product.price * (100 - product.discount) / 100}
                                precision={0}
                                prefix="₫"
                                valueStyle={{ color: '#cf1322', fontSize: '24px', fontWeight: 'bold' }}
                            />
                            <Text delete type="secondary" style={{ fontSize: '18px' }}>
                                ₫{Number(product.price).toLocaleString('vi-VN')}
                            </Text>
                            <Tag color="red" style={{ fontSize: '14px', padding: '4px 12px' }}>
                                -{product.discount}%
                            </Tag>
                        </>
                    ) : (
                        <Statistic
                            title="Giá"
                            value={product.price}
                            precision={0}
                            prefix="₫"
                            valueStyle={{ color: '#cf1322', fontSize: '24px', fontWeight: 'bold' }}
                        />
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
                            src={getProductImageUrl(item)}
                            height={200}
                            style={{ objectFit: 'cover' }}
                            preview={false}
                            fallback="/assets/placeholder-product.jpg"
                        />
                        }
                        onClick={() => navigate(`/product/${item.productId}`)}
                    >
                        <Meta
                        title={item.productName || 'Tên sản phẩm'}
                        description={
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            {item.discount && item.discount > 0 ? (
                                <>
                                    <Text strong style={{ color: '#cf1322', fontSize: '16px' }}>
                                        ₫{Number(item.price * (100 - item.discount) / 100).toLocaleString('vi-VN')}
                                    </Text>
                                    <Text delete type="secondary" style={{ fontSize: '12px' }}>
                                        ₫{Number(item.price).toLocaleString('vi-VN')}
                                    </Text>
                                </>
                            ) : (
                                <Text strong style={{ color: '#cf1322', fontSize: '16px' }}>
                                    ₫{Number(item.price || 0).toLocaleString('vi-VN')}
                                </Text>
                            )}
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