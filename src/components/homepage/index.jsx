import "./style.css";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row, Col, Card, Spin, Empty, Typography,
  Button, notification
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Header from "../layout/header";
import Footer from "../layout/footer";
import Banner from "../banner";
import Chatbot from "../chatbot";
import axiosSystem from "../../api/axiosSystem";

const { Meta } = Card;
const { Title, Text } = Typography;

// ProductCard component không thay đổi
const ProductCard = React.memo(({ product, onAddToCart, onViewProduct, formatPrice }) => {
  const handleCardClick = useCallback(() => {
    onViewProduct(product.productId);
  }, [onViewProduct, product.productId]);

  const handleAddToCartClick = useCallback((e) => {
    e.stopPropagation();
    onAddToCart(product);
  }, [onAddToCart, product]);

  return (
    <Card
      hoverable
      className="product-card"
      onClick={handleCardClick}
      cover={
        <div className="product-image-container">
          <img
            alt={product.productName}
            src={product.imageUrl}
            className="product-image"
            loading="lazy"
          />
        </div>
      }
    >
      <Meta
        title={
          <Text className="product-name">
            {product.productName}
          </Text>
        }
        description={
          <div className="product-info">
            <Text className="current-price">{formatPrice(product.price)}</Text>
          </div>
        }
      />
      <Button
        type="primary"
        block
        className="add-to-cart-btn"
        icon={<ShoppingCartOutlined />}
        onClick={handleAddToCartClick}
      >
        Thêm vào giỏ
      </Button>
    </Card>
  );
});


export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({ products: true });
  const navigate = useNavigate();

  const fetchNewProducts = useCallback(async () => {
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const response = await axiosSystem.get(`/Products/GetProductsPaged?page=1&pageSize=8`);
      setProducts(response.products || []);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm mới:", error);
      notification.error({
        message: 'Lỗi Tải Sản Phẩm',
        description: 'Không thể tải danh sách sản phẩm mới. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  useEffect(() => {
    fetchNewProducts();
  }, [fetchNewProducts]);

  const formatPrice = useCallback((price) => {
    if (typeof price !== 'number') return price;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }, []);

  const handleAddToCart = useCallback((product) => {
    notification.success({
      message: 'Thêm thành công!',
      description: `Đã thêm sản phẩm "${product.productName}" vào giỏ hàng.`,
      placement: 'bottomRight',
    });
  }, []);

  const handleViewProduct = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  return (
    <div className="homepage-container">
      <Header />
      <Banner />
      
      <main className="main-content">
        <section className="section">
          <div className="section-header">
            <Title level={2} className="section-title">Sản Phẩm Mới Nhất</Title>
            <Text className="section-subtitle">Khám phá những thiết kế thời trang vừa ra mắt</Text>
          </div>
          <div className="section-content">
            {loading.products ? (
              <div className="loading-container"><Spin size="large" /></div>
            ) : products.length > 0 ? (
              <Row gutter={[32, 40]} className="five-products-row">
                {products.map((product) => (
                  <Col key={product.productId} xs={12} sm={12} md={8} lg={6}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewProduct={handleViewProduct}
                      formatPrice={formatPrice}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="Hiện chưa có sản phẩm mới" />
            )}
          </div>
        </section>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}