import "./style.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Banner from "../Banner";
import Chatbot from "../Chatbot";
import {
  Row, Col, Card, Spin, Empty, Typography, Tabs,
  Button, Space, Rate, Tag, notification, Pagination
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const navigate = useNavigate();

  // FIX: Sử dụng useCallback với dependencies đúng
  const fetchProducts = useCallback(async (page, category) => {
    setLoading(true);
    
    const apiCategory = category === "Tất cả" ? "all" : category;
    
    try {
      const res = await axiosSystem.get(
        `/Products/GetProductsPaged?page=${page}&pageSize=10&category=${apiCategory}`
      );
      
      const productsWithCategory = res.products.map(product => ({
        ...product,
        categoryName: product.categoryId === 1 ? "Áo sơ mi" : 
                     product.categoryId === 2 ? "Quần âu" : "Phụ kiện",
        brandName: product.brandId === 1 ? "Torano" : "High Fashion",
        isNew: product.productId % 3 === 0,
        discount: product.productId % 4 === 0 ? 15 : 0,
        rating: 4 + (product.productId % 5) / 10
      }));
      
      setProducts(productsWithCategory);
      setPagination(prev => ({
        ...prev,
        current: res.pagination.currentPage,
        total: res.pagination.totalCount,
        totalPages: res.pagination.totalPages
      }));
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm", error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies - hàm không bao giờ thay đổi

  // FIX: useEffect chỉ phụ thuộc vào categoryFilter
  useEffect(() => {
    fetchProducts(1, categoryFilter);
  }, [categoryFilter]); // Loại bỏ fetchProducts khỏi dependencies

  // FIX: Hàm xử lý phân trang
  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, current: page }));
    fetchProducts(page, categoryFilter);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryFilter, fetchProducts]);

  // FIX: Hàm xử lý category
  const handleCategoryChange = useCallback((key) => {
    setCategoryFilter(key);
  }, []);

  // FIX: Memoize categories
  const categories = useMemo(() => [
    { key: "Tất cả", label: "Tất cả" },
    { key: "Áo sơ mi", label: "Áo sơ mi" },
    { key: "Quần âu", label: "Quần âu" },
    { key: "Phụ kiện", label: "Phụ kiện" },
  ], []);

  // FIX: Memoize formatPrice
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }, []);

  // FIX: Hàm thêm vào giỏ hàng
  const handleAddToCart = useCallback((product, e) => {
    e?.stopPropagation();
    notification.success({
      message: 'Thành công',
      description: `Đã thêm ${product.productName} vào giỏ hàng`
    });
  }, []);

  // FIX: Hàm xem chi tiết sản phẩm
  const handleViewProduct = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  // FIX: Tối ưu hiển thị sản phẩm
  const renderProducts = useMemo(() => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }

    if (products.length === 0) {
      return <Empty description="Không có sản phẩm nào" />;
    }

    return (
      <>
        <Row gutter={[24, 32]} className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onAddToCart={handleAddToCart}
              onViewProduct={handleViewProduct}
              formatPrice={formatPrice}
            />
          ))}
        </Row>

        <div className="pagination-container">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            className="products-pagination"
          />
        </div>
      </>
    );
  }, [loading, products, pagination, handleAddToCart, handleViewProduct, formatPrice, handlePageChange]);

  return (
    <div className="homePageContainer">
      <Header />
      <Banner />
      
      <div className="product-section">
        <div className="section-header">
          <Title level={1} className="section-title">
            SẢN PHẨM NỔI BẬT
          </Title>
          <Text className="section-subtitle">
            Khám phá các sản phẩm thời trang nam với thiết kế hiện đại và chất lượng cao cấp
          </Text>
        </div>
        
        <Tabs
          defaultActiveKey="Tất cả"
          centered
          items={categories}
          onChange={handleCategoryChange}
          className="category-tabs"
        />

        {renderProducts}
      </div>

      <FeaturedCategories onCategoryChange={handleCategoryChange} />
      <Chatbot/>
      <Footer />
    </div>
  );
}

// FIX: Tách ProductCard thành Pure Component
const ProductCard = React.memo(({ product, onAddToCart, onViewProduct, formatPrice }) => {
  // FIX: Memoize image source để tránh request liên tục
  const imageSrc = useMemo(() => 
    product.imageUrl || "/default-product.jpg"
  , [product.imageUrl]);

  const handleImageError = useCallback((e) => {
    e.target.src = "/default-product.jpg";
  }, []);

  const handleCardClick = useCallback(() => {
    onViewProduct(product.productId);
  }, [onViewProduct, product.productId]);

  const handleAddToCartClick = useCallback((e) => {
    onAddToCart(product, e);
  }, [onAddToCart, product]);

  const handleQuickView = useCallback((e) => {
    e.stopPropagation();
    onViewProduct(product.productId);
  }, [onViewProduct, product.productId]);

  return (
    <Card
      hoverable
      className="product-card"
      onClick={handleCardClick}
      cover={
        <div className="product-image-container">
          <img
            alt={product.productName}
            src={imageSrc}
            className="product-image"
            onError={handleImageError}
            loading="lazy" // FIX: Thêm lazy loading
          />
          <div className="product-overlay">
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />}
              className="action-button"
              onClick={handleAddToCartClick}
            >
              Thêm vào giỏ
            </Button>
            <Space>
              <Button 
                shape="circle" 
                icon={<EyeOutlined />}
                className="icon-button"
                onClick={handleQuickView}
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
              onClick={handleAddToCartClick}
            >
              Thêm vào giỏ
            </Button>
          </div>
        }
      />
    </Card>
  );
});

// FIX: Tách FeaturedCategories thành Pure Component
const FeaturedCategories = React.memo(({ onCategoryChange }) => {
  const categories = useMemo(() => [
    { key: "Áo sơ mi", label: "ÁO SƠ MI", image: "/products/shirts/ao-somi/image.png" },
    { key: "Quần âu", label: "QUẦN ÂU", image: "/products/pants/quan-tay/image.png" },
    { key: "Phụ kiện", label: "PHỤ KIỆN", image: "/products/accessories/image.jpg" },
  ], []);

  const handleCategoryClick = useCallback((categoryKey) => {
    onCategoryChange(categoryKey);
  }, [onCategoryChange]);

  return (
    <div className="featured-categories">
      <Title level={2} className="section-title">DANH MỤC NỔI BẬT</Title>
      <Row gutter={[24, 24]} className="categories-grid">
        {categories.map((category) => (
          <Col key={category.key} xs={12} md={8}>
            <Card 
              hoverable 
              className="category-card"
              onClick={() => handleCategoryClick(category.key)}
              cover={
                <img 
                  alt={category.label} 
                  src={category.image}
                  loading="lazy"
                />
              }
            >
              <Meta title={category.label} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
});