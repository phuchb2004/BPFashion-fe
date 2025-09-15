import "./style.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";
import Chatbot from "../../components/Chatbot";
import {
  Row, Col, Card, Spin, Empty, Typography, Tabs,
  Button, Space, Rate, Tag, notification
} from "antd";
import {
  ShoppingCartOutlined,
  EyeOutlined,
  HeartOutlined,
  StarFilled
} from "@ant-design/icons";
import axiosSystem from "../../api/axiosSystem";

const { Meta } = Card;
const { Title, Text } = Typography;

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const navigate = useNavigate();

  useEffect(() => {
    axiosSystem
      .get("/Products/GetAllProducts")
      .then((res) => {
        // Giả lập dữ liệu categoryName và brandName vì database không có
        const productsWithCategory = res.map(product => ({
          ...product,
          categoryName: product.categoryId === 1 ? "Áo sơ mi" : "Quần âu",
          brandName: product.brandId === 1 ? "Torano" : "High Fashion",
          isNew: product.productId % 3 === 0, // Giả lập sản phẩm mới
          discount: product.productId % 4 === 0 ? 15 : 0, // Giả lập giảm giá
          rating: 4 + (product.productId % 5) / 10 // Giả lập rating
        }));
        setProducts(productsWithCategory);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy sản phẩm", error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = [
    { key: "Tất cả", label: "Tất cả" },
    { key: "Áo sơ mi", label: "Áo sơ mi" },
    { key: "Quần âu", label: "Quần âu" },
  ];

  const filteredProducts =
    categoryFilter === "Tất cả"
      ? products
      : products.filter((p) => p.categoryName === categoryFilter);

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    notification.success({
      message: 'Thành công',
      description: `Đã thêm ${product.productName} vào giỏ hàng`
    });
    // Logic thêm vào giỏ hàng sẽ được triển khai sau
  };

  return (
    <div className="homePageContainer">
      <Header />
      <Banner />
      <div className="product-section">
        <div className="section-header">
          <Title
            level={1}
            className="section-title"
          >
            SẢN PHẨM NỔI BẬT
          </Title>
          <Text className="section-subtitle">
            Khám phá các sản phẩm thời trang nam với thiết kế hiện đại và chất lượng cao cấp
          </Text>
        </div>

        {/* Filter Tabs */}
        <Tabs
          defaultActiveKey="Tất cả"
          centered
          items={categories}
          onChange={(key) => setCategoryFilter(key)}
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
                        onError={(e) => {
                          e.target.src = "/default-product.jpg";
                        }}
                      />
                      <div className="product-overlay">
                        <Button 
                          type="primary" 
                          icon={<ShoppingCartOutlined />}
                          className="action-button"
                          onClick={(e) => handleAddToCart(product, e)}
                        >
                          Thêm vào giỏ
                        </Button>
                        <Space>
                          <Button 
                            shape="circle" 
                            icon={<EyeOutlined />}
                            className="icon-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${product.productId}`);
                            }}
                          />
                          <Button 
                            shape="circle" 
                            icon={<HeartOutlined />}
                            className="icon-button"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Space>
                      </div>
                      {product.isNew && <Tag color="red" className="new-tag">MỚI</Tag>}
                      {product.discount > 0 && (
                        <Tag color="#d0021b" className="discount-tag">
                          -{product.discount}%
                        </Tag>
                      )}
                    </div>
                  }
                  actions={[
                    <div className="product-card-footer">
                      <Rate 
                        disabled 
                        defaultValue={product.rating} 
                        character={<StarFilled />}
                        className="product-rating"
                      />
                      <Text type="secondary" className="product-brand">
                        {product.brandName}
                      </Text>
                    </div>
                  ]}
                >
                  <Meta
                    title={
                      <Text className="product-name" ellipsis={{ tooltip: product.productName }}>
                        {product.productName}
                      </Text>
                    }
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
                        <div className="product-details">
                          <Text type="secondary" className="product-material">
                            Chất liệu: {product.material}
                          </Text>
                          <Text type="secondary" className="product-size">
                            Size: {product.size}
                          </Text>
                        </div>
                        <Button 
                          type="primary" 
                          block 
                          className="add-to-cart-btn"
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

      <div className="featured-categories">
        <Title level={2} className="section-title">DANH MỤC NỔI BẬT</Title>
        <Row gutter={[24, 24]} className="categories-grid">
          <Col xs={12} md={8}>
            <Card 
              hoverable 
              className="category-card"
              onClick={() => setCategoryFilter("Áo sơ mi")}
              cover={
                <img
                  alt="Áo sơ mi"
                  src="/products/shirts/ao-somi/image.png"
                />
              }
            >
              <Meta title="ÁO SƠ MI" />
            </Card>
          </Col>
          <Col xs={12} md={8}>
            <Card 
              hoverable 
              className="category-card"
              onClick={() => setCategoryFilter("Quần âu")}
              cover={
                <img
                  alt="Quần âu"
                  src="/products/pants/quan-tay/image.png"
                />
              }
            >
              <Meta title="QUẦN ÂU" />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card 
              hoverable 
              className="category-card"
              cover={
                <img
                  alt="Phụ kiện"
                  src="/products/accessories/image.jpg"
                />
              }
            >
              <Meta title="PHỤ KIỆN" />
            </Card>
          </Col>
        </Row>
      </div>
      <Chatbot/>
      <Footer />
    </div>
  );
}