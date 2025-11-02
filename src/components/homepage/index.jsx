import "./style.css";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row, Col, Card, Spin, Empty, Typography,
  Button
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Header from "../layout/header";
import Footer from "../layout/footer";
import Banner from "../banner";
import Chatbot from "../chatbot";
import baseApi from "../../api/baseApi";
import { useTranslation } from "react-i18next";
import { showError, showCartNotification } from "../../utils/notification";
import getProductImageUrl from "../../utils/productImageHelper";

const { Meta } = Card;
const { Title, Text } = Typography;

const ProductCard = React.memo(({ product, imageUrl, formattedPrice, onAddToCart, onViewProduct }) => {
  const handleCardClick = () => {
    onViewProduct(product.productId);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Card
      hoverable
      className="product-card"
      onClick={handleCardClick}
      cover={
        <div className="product-image-container">
          <img
            alt={product.productName}
            src={imageUrl}
            className="product-image"
            loading="lazy"
            decoding="async"
          />
        </div>
      }
    >
      <Meta
        title={<Text className="product-name">{product.productName}</Text>}
        description={
          <div className="product-info">
            <Text className="current-price">{formattedPrice}</Text>
          </div>
        }
      />
      <Button
        type="primary"
        block
        className="add-to-cart-btn"
        icon={<ShoppingCartOutlined />}
        onClick={handleAddToCart}
      >
        Thêm vào giỏ
      </Button>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.product.productId === nextProps.product.productId &&
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.formattedPrice === nextProps.formattedPrice
  );
});

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        setLoading(true);
        const response = await baseApi.get(`/Products/GetProductsPaged?page=1&pageSize=8`);
        
        const productsList = response?.products;
        setProducts(Array.isArray(productsList) ? productsList : []);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm mới:", error);
        const errorMsg = error.response.message || t("homepage.newProducts.error.description");
        showError(
          t("homepage.newProducts.error.title"),
          errorMsg
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, [t]);

  const processedProducts = useMemo(() => {
    return products.map(product => ({
      ...product,
      imageUrl: getProductImageUrl(product),
      formattedPrice: product.price 
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)
        : 'Liên hệ'
    }));
  }, [products]);

  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showError("Vui lòng đăng nhập", "Vui lòng đăng nhập trước khi mua hàng");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      // Find first available variant (since we don't have size selection on listing pages)
      let variantId = null;
      if (product.Variants && product.Variants.length > 0) {
        variantId = product.Variants[0].variantId;
      } else {
        // If no variants, navigate to product detail page to select size
        navigate(`/product/${product.productId}`);
        return;
      }

      await baseApi.post("/Cart/AddToCart", {
        userId: parseInt(userId),
        variantId: variantId,
        quantity: 1
      });

      showCartNotification(
        t("homepage.addToCart.success.title"),
        t("homepage.addToCart.success.description", { productName: product.productName })
      );

      // Refresh cart in header
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      const errorMsg = error.response?.data?.message || "Thêm sản phẩm vào giỏ hàng thất bại";
      showError("Lỗi", errorMsg);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="homepage-container">
      <Header />
      <Banner />
      
      <main className="main-content">
        <section className="section">
          <div className="section-header">
            <Title level={2} className="section-title">{t("homepage.newProducts.title")}</Title>
            <Text className="section-subtitle">{t("homepage.newProducts.subtitle")}</Text>
          </div>
          <div className="section-content">
            {loading ? (
              <div className="loading-container"><Spin size="large" /></div>
            ) : processedProducts.length > 0 ? (
              <Row gutter={[32, 40]} className="five-products-row">
                {processedProducts.map((product) => (
                  <Col key={product.productId} xs={12} sm={12} md={8} lg={6}>
                    <ProductCard
                      product={product}
                      imageUrl={product.imageUrl}
                      formattedPrice={product.formattedPrice}
                      onAddToCart={handleAddToCart}
                      onViewProduct={handleViewProduct}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description={t("homepage.newProducts.empty")} />
            )}
          </div>
        </section>
      </main>
      <Chatbot />
      <Footer />
    </div>
  );
}