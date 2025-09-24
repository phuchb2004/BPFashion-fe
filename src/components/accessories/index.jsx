// src/pages/Accessories/AccessoriesPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Row, Col, Card, Spin, Empty, Typography, Tabs,
  Button, Space, Rate, Tag, notification, Breadcrumb
} from "antd";
import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import axiosSystem from "../../api/axiosSystem";
import "./style.css";

const { Title, Text } = Typography;
const { Meta } = Card;

export default function AccessoriesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = () => {
    axiosSystem
      .get("/Products/GetAllProducts")
      .then((res) => {
        const accessories = res.filter(product => 
          product.categoryName?.includes("Phụ kiện") || 
          product.categoryId === 3 // Giả sử categoryId 3 là phụ kiện
        ).map(product => ({
          ...product,
          categoryName: product.categoryName || "Phụ kiện",
          brandName: product.brandName || "Accessory Brand",
          isNew: product.productId % 3 === 0,
          discount: product.productId % 4 === 0 ? 15 : 0,
          rating: 4 + (product.productId % 5) / 10
        }));
        setProducts(accessories);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách phụ kiện", error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách phụ kiện. Vui lòng thử lại sau.'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const accessoryTypes = [
    { key: "all", label: "Tất cả phụ kiện" },
    { key: "do-lot", label: "Đồ lót" },
    { key: "tat", label: "Tất" },
    { key: "day-lung", label: "Dây lưng" },
    { key: "vi-da", label: "Ví da" },
  ];

  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(product => product.productName?.toLowerCase().includes(activeTab));

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
              { title: <HomeOutlined />, onClick: () => navigate("/home-page") },
              { title: 'Trang chủ', onClick: () => navigate("/home-page") },
              { title: 'Phụ kiện' },
            ]}
          />
          <Title level={1} className="page-title">PHỤ KIỆN NAM</Title>
          <Text className="page-subtitle">
            Hoàn thiện phong cách với các phụ kiện nam tinh tế và chất lượng
          </Text>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          <Tabs
            activeKey={activeTab}
            items={accessoryTypes}
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
            <Row gutter={[24, 32]} className="products-grid">
              {filteredProducts.map((product) => (
                <Col key={product.productId} xs={12} sm={8} md={6} lg={6}>
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
                        {product.isNew && <Tag color="red" className="new-tag">MỚI</Tag>}
                        {product.discount > 0 && (
                          <Tag color="#d0021b" className="discount-tag">
                            -{product.discount}%
                          </Tag>
                        )}
                      </div>
                    }
                  >
                    <Meta
                      title={product.productName}
                      description={
                        <div className="product-info">
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
                          <Text type="secondary">Chất liệu: {product.material}</Text>
                          <Button 
                            type="primary" 
                            block 
                            icon={<ShoppingCartOutlined />}
                            onClick={(e) => handleAddToCart(product, e)}
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
        </div>
      </div>
      
      <Footer />
    </div>
  );
}