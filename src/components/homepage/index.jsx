import "./style.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import Banner from "../Banner";
import Chatbot from "../Chatbot";
import {
  Row, Col, Card, Spin, Empty, Typography,
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
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNewProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosSystem.get(
        `/Products/GetProductsPaged?page=1&pageSize=8&category=all`
      );
      
      const newProductsWithDetails = res.products.slice(0, 8).map(product => ({
        ...product,
        categoryName: product.categoryId === 1 ? "Áo sơ mi" : 
        product.categoryId === 2 ? "Quần âu" : "Phụ kiện",
        brandName: "D2 SHOP",
        isNew: true,
        discount: product.productId % 4 === 0 ? 15 : 0,
        rating: 4 + (product.productId % 5) / 10
      }));
      
      setNewProducts(newProductsWithDetails);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm mới", error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải sản phẩm mới. Vui lòng thử lại sau.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const mockCategories = [
        {
          id: 1,
          name: "ÁO SƠ MI",
          image: "../assets/products/shirts/ao-somi/image.png",
          description: "Áo sơ mi công sở, dự tiệc",
          productCount: 99
        },
        {
          id: 2,
          name: "ÁO POLO",
          image: "../assets/products/shirts/ao-polo/image.png",
          description: "Áo polo thể thao, casual",
          productCount: 18
        },
        {
          id: 3,
          name: "ÁO THUN",
          image: "../assets/products/shirts/ao-thun/image.png",
          description: "Áo thun basic, thoải mái",
          productCount: 32
        },
        {
          id: 4,
          name: "ÁO NỈ",
          image: "../assets/products/shirts/ao-ni/image.png",
          description: "Áo nỉ ấm áp mùa đông",
          productCount: 15
        }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục", error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh mục sản phẩm. Vui lòng thử lại sau.'
      });
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewProducts();
    fetchCategories();
  }, [fetchNewProducts, fetchCategories]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }, []);

  const handleAddToCart = useCallback((product, e) => {
    e?.stopPropagation();
    notification.success({
      message: 'Thành công',
      description: `Đã thêm ${product.productName} vào giỏ hàng`
    });
  }, []);

  const handleViewProduct = useCallback((productId) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  const handleCategoryClick = useCallback((categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  }, [navigate]);

  const renderNewProducts = useMemo(() => {
    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }

    if (newProducts.length === 0) {
      return <Empty description="Không có sản phẩm mới" />;
    }

    return (
      <Row gutter={[24, 32]} className="new-products-grid">
        {newProducts.map((product) => (
          <Col key={product.productId} xs={12} sm={8} md={6} lg={6}>
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              onViewProduct={handleViewProduct}
              formatPrice={formatPrice}
            />
          </Col>
        ))}
      </Row>
    );
  }, [loading, newProducts, handleAddToCart, handleViewProduct, formatPrice]);

  const renderCategories = useMemo(() => {
    if (categoriesLoading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }

    return (
      <Row gutter={[24, 24]} className="categories-grid">
        {categories.map((category) => (
          <Col key={category.id} xs={12} md={6} lg={6}>
            <CategoryCard
              category={category}
              onClick={handleCategoryClick}
            />
          </Col>
        ))}
      </Row>
    );
  }, [categoriesLoading, categories, handleCategoryClick]);

  return (
    <div className="homePageContainer">
      <Header />
      <Banner />
      
      {/* Phần SẢN PHẨM MỚI */}
      <div className="new-products-section">
        <div className="section-header">
          <Title level={1} className="section-title">
            SẢN PHẨM MỚI
          </Title>
        </div>
        
        {renderNewProducts}
      </div>
      <div className="categories-section">
        <div className="section-header">
          <Title level={2} className="section-title">
            DANH MỤC SẢN PHẨM
          </Title>
          <Text className="section-subtitle">
            Lựa chọn theo danh mục yêu thích của bạn
          </Text>
        </div>

        {renderCategories}
      </div>

      <Chatbot/>
      <Footer />
    </div>
  );
}

const ProductCard = React.memo(({ product, onAddToCart, onViewProduct, formatPrice }) => {
  const imageSrc = useMemo(() => product.imageUrl, [product.imageUrl]);

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
            loading="lazy"
          />
          <div className="product-overlay">
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
    >
      <Meta
        title={
          <div className="product-header">
            <Text className="product-brand">{product.brandName}</Text>
            <Text className="product-name" ellipsis={{ tooltip: product.productName }}>
              {product.productName}
            </Text>
          </div>
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
            <Rate 
              disabled 
              defaultValue={product.rating} 
              character={<StarFilled />}
              className="product-rating"
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
          </div>
        }
      />
    </Card>
  );
});

const CategoryCard = React.memo(({ category, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(category.name);
  }, [onClick, category.name]);

  return (
    <Card
      hoverable
      className="category-card"
      onClick={handleClick}
      cover={
        <div className="category-image-container">
          <img
            alt={category.name}
            src={category.image}
            className="category-image"
            loading="lazy"
          />
        </div>
      }
    >
      <Meta
        title={category.name}
        description={
          <div className="category-info">
            <Text className="category-description">{category.description}</Text>
            <Text className="product-count">{category.productCount} sản phẩm</Text>
          </div>
        }
      />
    </Card>
  );
});