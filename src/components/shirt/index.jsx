// src/pages/Shirts/ShirtsPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import {
  Row, Col, Card, Spin, Empty, Typography, Tabs,
  Button, Space, Rate, Tag, notification, Breadcrumb,
  Checkbox, Divider, Input
} from "antd";
import { HomeOutlined, ShoppingCartOutlined, FilterOutlined } from "@ant-design/icons";
import axiosSystem from "../../api/axiosSystem";
import "./style.css";

const { Title, Text } = Typography;
const { Meta } = Card;
const { Search } = Input;

export default function ShirtsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  // State for filters
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  useEffect(() => {
    fetchShirts();
  }, []);

  const fetchShirts = () => {
    axiosSystem
      .get("/Products/GetAllProducts")
      .then((res) => {
        const shirts = res.filter(product => 
          product.categoryName?.includes("Áo") || 
          product.categoryId === 1
        ).map(product => ({
          ...product,
          categoryName: product.categoryName || "Áo sơ mi",
          brandName: product.brandName || "Torano",
          isNew: product.productId % 3 === 0,
          isHot: product.productId % 5 === 0,
          discount: product.productId % 4 === 0 ? 15 : 0,
          rating: 4 + (product.productId % 5) / 10,
          color: ["Đỏ", "Xám", "Xanh", "Đen", "Trắng"][product.productId % 5]
        }));
        setProducts(shirts);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách áo", error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách áo. Vui lòng thử lại sau.'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Filter options from image
  const colorOptions = [
    { label: "Đỏ", value: "Đỏ" },
    { label: "Xám", value: "Xám" },
    { label: "Xám Đen", value: "Xám Đen" },
    { label: "Kem", value: "Kem" }
  ];

  const priceOptions = [
    { label: "Giá dưới 200,000đ", value: "0-200000" },
    { label: "200,000đ - 300,000đ", value: "200000-300000" },
    { label: "300,000đ - 400,000đ", value: "300000-400000" },
    { label: "400,000đ - 600,000đ", value: "400000-600000" },
    { label: "Giá trên 800,000đ", value: "800000-9999999" }
  ];

  const statusOptions = [
    { label: "New", value: "new" },
    { label: "Hot", value: "hot" }
  ];

  const discountCoupons = [
    { discount: "5%", condition: "cho đơn hàng từ 1TR", code: "D250MD5", expiry: "10/1/2024" },
    { discount: "7%", condition: "cho đơn hàng từ 1.5TR", code: "D250MD7", expiry: "10/1/2024" },
    { discount: "10%", condition: "cho đơn hàng từ 2TR", code: "D250MD10", expiry: "10/1/2024" }
  ];

  // Filter products based on selections
  const filteredProducts = products.filter(product => {
    // Tab filter
    if (activeTab !== "all" && !product.productName?.toLowerCase().includes(activeTab)) {
      return false;
    }
    
    // Color filter
    if (selectedColors.length > 0 && !selectedColors.includes(product.color)) {
      return false;
    }
    
    // Price filter
    if (selectedPrices.length > 0) {
      const priceMatch = selectedPrices.some(priceRange => {
        const [min, max] = priceRange.split('-').map(Number);
        return product.price >= min && product.price <= max;
      });
      if (!priceMatch) return false;
    }
    
    // Status filter
    if (selectedStatus.length > 0) {
      if (selectedStatus.includes("new") && !product.isNew) return false;
      if (selectedStatus.includes("hot") && !product.isHot) return false;
    }
    
    return true;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    notification.success({
      message: 'Thành công',
      description: `Đã thêm ${product.productName} vào giỏ hàng`
    });
  };

  return (
    <div className="category-page">
      <Header />
      
      <div className="page-header">
        <div className="container">
          <Breadcrumb
            items={[
              { title: <HomeOutlined />, onClick: () => navigate("/homepage") },
              { title: 'Trang chủ', onClick: () => navigate("/homepage") },
              { title: 'Áo Nam' },
            ]}
          />
          <Title level={1} className="page-title">ÁO NAM</Title>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <Row gutter={24}>
            <Col xs={24} md={6}>
              <div className="filter-sidebar">
                <div className="filter-section">
                  <Title level={4} className="filter-title">
                    <FilterOutlined /> MÀU SẮC
                  </Title>
                  <Checkbox.Group 
                    options={colorOptions} 
                    value={selectedColors}
                    onChange={setSelectedColors}
                    className="filter-group"
                  />
                </div>
                <Divider />
                <div className="filter-section">
                  <Title level={4} className="filter-title">MỨC GIÁ</Title>
                  <Checkbox.Group 
                    options={priceOptions} 
                    value={selectedPrices}
                    onChange={setSelectedPrices}
                    className="filter-group"
                  />
                </div>
                <Divider />
                <div className="filter-section">
                  <Title level={4} className="filter-title">SẢN PHẨM</Title>
                  <Checkbox.Group 
                    options={statusOptions} 
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    className="filter-group"
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} md={18}>
              <Tabs
                activeKey={activeTab}
                items={[
                  { key: "all", label: "Tất cả áo" },
                  { key: "so-mi", label: "Áo sơ mi" },
                  { key: "ao-phong", label: "Áo phông" },
                  { key: "ao-khoac", label: "Áo khoác" },
                ]}
                onChange={setActiveTab}
                className="category-tabs"
              />

              {loading ? (
                <div className="loading-container">
                  <Spin size="large" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <Empty description="Không có sản phẩm nào" />
              ) : (
                <Row gutter={[16, 24]} className="products-grid">
                  {filteredProducts.map((product) => (
                    <Col key={product.productId} xs={12} lg={8} xl={6}>
                      <Card
                        hoverable
                        className="product-card"
                        onClick={() => navigate(`/product/${product.productId}`)}
                        cover={
                          <div className="product-image-container">
                            <img
                              alt={product.productName}
                              src={product.imageUrl || "/default-product.jpg"}
                              className="product-image"
                            />
                            <div className="product-overlay">
                              <Button 
                                type="primary" 
                                icon={<ShoppingCartOutlined />}
                                onClick={(e) => handleAddToCart(product, e)}
                              >
                                Thêm vào giỏ
                              </Button>
                            </div>
                            {product.isNew && <Tag color="red" className="new-tag">NEW</Tag>}
                            {product.isHot && <Tag color="orange" className="hot-tag">HOT</Tag>}
                            {product.discount > 0 && (
                              <Tag color="#d0021b" className="discount-tag">
                                -{product.discount}%
                              </Tag>
                            )}
                          </div>
                        }
                      >
                        <Meta
                          title={<Text strong>{product.productName}</Text>}
                          description={
                            <div className="product-info">
                              <div className="product-brand">
                                <Text type="secondary">{product.brandName}</Text>
                              </div>
                              <div className="product-price">
                                {product.discount > 0 ? (
                                  <>
                                    <Text className="current-price">
                                      {formatPrice(product.price * (100 - product.discount) / 100)}
                                    </Text>
                                    <Text className="original-price" delete>
                                      {formatPrice(product.price)}
                                    </Text>
                                  </>
                                ) : (
                                  <Text className="current-price">
                                    {formatPrice(product.price)}
                                  </Text>
                                )}
                              </div>
                              <Button 
                                type="primary" 
                                block 
                                icon={<ShoppingCartOutlined />}
                                onClick={(e) => handleAddToCart(product, e)}
                                className="add-to-cart-btn"
                              >
                                Thêm vào giỏ
                              </Button>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}