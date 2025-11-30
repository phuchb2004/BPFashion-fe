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

const ProductCard = React.memo(({ product, imageUrl, formattedPrice, onAddToCart, onViewProduct, addToCartText }) => {
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
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/logo2.png';
            }}
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
        {addToCartText}
      </Button>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.product.productId === nextProps.product.productId &&
    prevProps.imageUrl === nextProps.imageUrl &&
    prevProps.formattedPrice === nextProps.formattedPrice &&
    prevProps.addToCartText === nextProps.addToCartText
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
        const productsList = response.products;
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
        : t("homepage.contact")
    }));
  }, [products, t]);

  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showError(t("homepage.addToCart.loginRequired.title"), t("homepage.addToCart.loginRequired.description"));
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      let variantId = null;
      if (product.variants && product.variants.length > 0) {
        variantId = product.variants[0].variantId;
      } else {
        console.log("Sản phẩm chưa có thông tin Variant, chuyển hướng đến chi tiết:", product.productName);
        navigate(`/product/${product.productId}`);
        return;
      }

      const payload = {
        userId: parseInt(userId),
        variantId: variantId,
        quantity: 1
      };

      await baseApi.post("/Cart/AddToCart", payload);

      showCartNotification(
        t("homepage.addToCart.success.title"),
        t("homepage.addToCart.success.description", { productName: product.productName })
      );

      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      const errorMsg = error.response?.data?.message || t("homepage.addToCart.error.description");
      showError(t("homepage.addToCart.error.title"), errorMsg);
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
                      addToCartText={t("homepage.addToCart.button")}
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