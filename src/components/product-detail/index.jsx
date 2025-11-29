import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Button, Spin, Select, Breadcrumb, Divider, Tabs, Card, Row, Col,
    InputNumber, Space, Tag, Image, Typography, Statistic,
    Badge, Alert
} from "antd";
import {
    ShoppingCartOutlined,
    HeartOutlined,
    ShareAltOutlined,
    HomeOutlined,
    EyeOutlined,
    SafetyCertificateOutlined,
    RocketOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import baseApi from "../../api/baseApi";
import Header from "../layout/header";
import Footer from "../layout/footer";
import { showSuccess, showError, showCartNotification } from "../../utils/notification";
import getProductImageUrl from "../../utils/productImageHelper";
import { useTranslation } from "react-i18next";
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
    
    // State quản lý lựa chọn
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    
    // State hiển thị
    const [displayPrice, setDisplayPrice] = useState(0);
    const [displayStock, setDisplayStock] = useState(0);
    const [availableColors, setAvailableColors] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setProduct(null);
        setSelectedColor(null);
        setSelectedSize(null);
        setSelectedVariant(null);
        setQuantity(1);
        
        fetchProductDetails();
        fetchRelatedProducts();
        
        window.scrollTo(0, 0);
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            const response = await baseApi.get(`/Products/GetProductById/${id}`);
            const productData = response?.data || response;

            if (productData) {
                // --- SỬA: Dùng 'variants' (chữ thường) ---
                if (productData.variants && productData.variants.length > 0) {
                    // --- SỬA: Dùng 'colorName' và 'sizeName' (chữ thường) ---
                    const allColors = [...new Set(productData.variants.map(v => v.colorName).filter(Boolean))];
                    const allSizes = [...new Set(productData.variants.map(v => v.sizeName).filter(Boolean))];
                    
                    setAvailableColors(allColors);
                    setAvailableSizes(allSizes);

                    // --- SỬA: Dùng 'price' và 'stockQuantity' (chữ thường) ---
                    const minPrice = productData.price || Math.min(...productData.variants.map(v => v.price));
                    const totalStock = productData.totalStock || productData.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
                    
                    productData.minPrice = minPrice;
                    productData.totalStock = totalStock;

                    setDisplayPrice(minPrice);
                    setDisplayStock(totalStock);
                }

                setProduct(productData);
            }
        } catch (err) {
            console.error("Lỗi:", err);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async () => {
        try {
            // API GetAllProducts giờ đã có trong Backend
            const response = await baseApi.get("/Products/GetAllProducts");
            const allProducts = response?.data || response?.products || response || [];
            
            const filteredProducts = allProducts
                .filter(p => p.productId !== parseInt(id))
                .slice(0, 4);
            setRelatedProducts(filteredProducts);
        } catch (err) {
            console.error("Lỗi lấy sản phẩm liên quan:", err);
        }
    };

    const updateVariantSelection = (color, size) => {
        if (color && size) {
            // --- SỬA: Dùng 'variants', 'colorName', 'sizeName' (chữ thường) ---
            const variant = product.variants?.find(v => v.colorName === color && v.sizeName === size);
            if (variant) {
                setSelectedVariant(variant);
                setDisplayPrice(variant.price);
                setDisplayStock(variant.stockQuantity);
                setQuantity(1);
            } else {
                setSelectedVariant(null);
                setDisplayStock(0);
            }
        } else {
            setSelectedVariant(null);
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
        updateVariantSelection(color, selectedSize);
    };

    const handleSizeChange = (size) => {
        setSelectedSize(size);
        updateVariantSelection(selectedColor, size);
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            showError("Thông báo", "Vui lòng chọn đầy đủ Màu sắc và Kích thước");
            return;
        }

        if (displayStock === 0 || displayStock < quantity) {
             showError("Thông báo", "Sản phẩm này đã hết hàng hoặc không đủ số lượng");
             return;
        }

        try {
            setAddingToCart(true);
            const userId = localStorage.getItem("userId");
            if (!userId) {
                showError("Yêu cầu đăng nhập", "Vui lòng đăng nhập để mua hàng");
                setTimeout(() => navigate("/login"), 1500);
                return;
            }

            const requestPayload = {
                userId: parseInt(userId),
                variantId: selectedVariant.variantId,
                quantity: quantity
            };

            await baseApi.post("/Cart/AddToCart", requestPayload);
            
            showCartNotification("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
            window.dispatchEvent(new Event('cartUpdated'));
            
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng";
            showError("Lỗi", errorMsg);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!selectedVariant) {
             showError("Thông báo", "Vui lòng chọn đầy đủ Màu sắc và Kích thước");
             return;
        }
        await handleAddToCart();
        navigate("/checkout");
    };

    const handleShareProduct = () => {
        navigator.clipboard.writeText(window.location.href);
        showSuccess("Thành công", "Đã sao chép liên kết sản phẩm");
    };

    if (loading) return <div className="loading-container"><Spin size="large" /><Text>Đang tải...</Text></div>;
    if (!product) return <div className="error-container"><Title level={2}>Không tìm thấy sản phẩm</Title></div>;

    const originalPrice = displayPrice;
    const discount = product.discount || 0; 
    const finalPrice = discount > 0 ? originalPrice * (100 - discount) / 100 : originalPrice;
    console.log("Product Data:", product);

    return (
        <>
        <Header />
        <div className="product-detail-container">
            <Breadcrumb 
                items={[
                    { title: <HomeOutlined />, href: "/" }, 
                    { title: product.categoryName, href: '/product' }, 
                    { title: product.productName }
                ]} 
                style={{ marginBottom: 20 }} 
            />

            <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                    <Card 
                        cover={<Image src={getProductImageUrl(product)} alt={product.productName} style={{ width: '100%', height: '400px', objectFit: 'cover' }} fallback="/assets/logo2.png" />}
                        actions={[<EyeOutlined key="view" />, <HeartOutlined key="like" />, <ShareAltOutlined key="share" onClick={handleShareProduct} />]}
                    >
                        <Meta title={product.productName} description={<Text type="secondary">Mã: {product.productId} | {product.CategoryName}</Text>} />
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Title level={2}>{product.productName}</Title>
                        <Space align="baseline" size="large">
                            {discount > 0 ? (
                                <>
                                    <Statistic 
                                        value={finalPrice} 
                                        precision={0} prefix="₫" 
                                        valueStyle={{ color: '#cf1322', fontSize: '24px', fontWeight: 'bold' }} 
                                    />
                                    <Text delete type="secondary" style={{ fontSize: '18px' }}>
                                        ₫{Number(originalPrice).toLocaleString('vi-VN')}
                                    </Text>
                                    <Tag color="red">-{discount}%</Tag>
                                </>
                            ) : (
                                <Statistic 
                                    value={finalPrice} 
                                    precision={0} prefix="₫" 
                                    valueStyle={{ color: '#cf1322', fontSize: '24px', fontWeight: 'bold' }} 
                                />
                            )}
                        </Space>
                        <div>
                            <Text strong>Tình trạng: </Text>
                            {displayStock > 0 ? (
                                <Tag color="green" icon={<CheckCircleOutlined />}>
                                    {selectedVariant
                                        ? `Còn ${displayStock} sản phẩm`
                                        : `Tổng kho: ${product.totalStock} sản phẩm (Vui lòng chọn phân loại)`}
                                </Tag>
                            ) : (
                                <Tag color="red">Hết hàng</Tag>
                            )}
                        </div>

                        {/* Chọn Màu */}
                        {availableColors.length > 0 && (
                            <div>
                                <Text strong>Màu sắc: </Text>
                                <Select
                                    value={selectedColor}
                                    onChange={handleColorChange}
                                    style={{ width: 150, marginLeft: 8 }}
                                    placeholder="Chọn màu"
                                >
                                    {availableColors.map(color => (
                                        <Option key={color} value={color}>{color}</Option>
                                    ))}
                                </Select>
                            </div>
                        )}

                        {/* Chọn Size */}
                        {availableSizes.length > 0 && (
                            <div>
                                <Text strong>Kích thước (Size): </Text>
                                <Select
                                    value={selectedSize}
                                    onChange={handleSizeChange}
                                    style={{ width: 150, marginLeft: 8 }}
                                    placeholder="Chọn size"
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
                                max={selectedVariant ? displayStock : 1}
                                value={quantity}
                                onChange={(val) => setQuantity(val)}
                                disabled={!selectedVariant || displayStock === 0}
                                style={{ width: 100, marginLeft: 8 }}
                            />
                        </div>

                        <Space>
                            <Button
                                type="primary" size="large" icon={<ShoppingCartOutlined />}
                                loading={addingToCart}
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || displayStock === 0}
                            >
                                Thêm vào giỏ
                            </Button>
                            <Button
                                size="large" style={{ background: '#ff4d4f', color: 'white' }}
                                onClick={handleBuyNow}
                                disabled={!selectedVariant || displayStock === 0}
                            >
                                Mua ngay
                            </Button>
                        </Space>
                        <Divider />
                        <Alert message="Chính sách giao hàng" description="Miễn phí vận chuyển cho đơn hàng > 500k. Giao hàng 2-4 ngày." type="info" showIcon />
                    </Space>
                </Col>
            </Row>
            
            <Divider />
            <Card>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="Mô tả sản phẩm" key="1">
                        <Paragraph>{product.description}</Paragraph>
                        <Text strong>Chất liệu: </Text> <Text>{product.material}</Text>
                    </TabPane>
                </Tabs>
            </Card>

            {relatedProducts.length > 0 && (
                <>
                    <Title level={3}>Sản phẩm liên quan</Title>
                    <Row gutter={[16, 16]}>
                        {relatedProducts.map(item => (
                            <Col xs={12} sm={8} md={6} key={item.productId}>
                                <Card
                                    hoverable
                                    cover={<Image alt={item.productName} src={getProductImageUrl(item)} height={200} style={{ objectFit: 'cover' }} preview={false} fallback="/assets/logo2.png" />}
                                    onClick={() => navigate(`/product/${item.productId}`)}
                                >
                                    <Meta 
                                        title={item.productName} 
                                        description={
                                            <Text strong style={{ color: '#cf1322' }}>
                                                ₫{Number(item.price || 0).toLocaleString('vi-VN')}
                                            </Text>
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