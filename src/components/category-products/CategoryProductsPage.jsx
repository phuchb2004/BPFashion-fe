import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import {
  Row, Col, Card, Spin, Empty, Typography, Tabs,
  Button
} from "antd";
import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Breadcrumb from "../breadcrumb";
import baseApi from "../../api/baseApi";
import getProductImageUrl from "../../utils/productImageHelper";
import { showError, showCartNotification } from "../../utils/notification";
import { useTranslation } from "react-i18next";
import "../category-products/style.css";

const { Text } = Typography;
const { Meta } = Card;

export default function CategoryProductsPage({ 
  categoryId, 
  categoryName, 
  tabs = [],
  filterProducts = null 
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchProducts();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await baseApi.get(`/Products/GetProductsByCategory/${categoryId}`);

      const allProducts = Array.isArray(response) 
        ? response 
        : Array.isArray(response?.data) 
          ? response.data 
          : Array.isArray(response?.products)
            ? response.products
            : [];

      const mappedProducts = allProducts.map(product => ({
        ...product,
        categoryName: product.CategoryName || product.categoryName || categoryName,
        price: product.price || (product.Variants && product.Variants.length > 0 
          ? Math.min(...product.Variants.map(v => v.price || 0))
          : 0),
        stockQuantity: product.stockQuantity || (product.Variants && product.Variants.length > 0
          ? product.Variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0)
          : 0),
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách ${categoryName}`, error);
      showError(t("category.error.title"), t("category.error.description", { categoryName }));
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return t("common.contact");
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showError(t("common.loginRequired.title"), t("common.loginRequired.description"));
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      let variantId = null;
      if (product.Variants && product.Variants.length > 0) {
        variantId = product.Variants[0].variantId;
      } else {
        navigate(`/product/${product.productId}`);
        return;
      }

      await baseApi.post("/Cart/AddToCart", {
        userId: parseInt(userId),
        variantId: variantId,
        quantity: 1
      });
      showCartNotification(t("category.addToCart.success"), t("category.addToCart.successDesc", { productName: product.productName }));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      const errorMsg = error.response?.data?.message || t("category.addToCart.errorDesc");
      showError(t("category.addToCart.error"), errorMsg);
    }
  };

  const filteredProducts = useMemo(() => {
    if (activeTab === "all") {
      return products;
    }
    
    if (filterProducts) {
      return filterProducts(products, activeTab);
    }
    
    return products.filter(product => {
      const name = (product.productName || '').toLowerCase();
      return name.includes(activeTab.toLowerCase());
    });
  }, [products, activeTab, filterProducts]);

  return (
    <div className="category-page">
      <Header />
      <div className="page-header">
        <div className="page-header-inner">
            <Breadcrumb
              items={[
                { title: <HomeOutlined />, onClick: () => navigate("/homepage") },
                { title: categoryName },
              ]}
            />
        </div>
      </div>

      <div className="page-content">
        {tabs.length > 0 && (
          <Tabs
            activeKey={activeTab}
            items={tabs}
            onChange={setActiveTab}
            className="category-tabs"
          />
        )}

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty description={t("category.empty")} />
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
                        src={getProductImageUrl(product)}
                        className="product-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/logo2.png';
                        }}
                      />
                    </div>
                  }
                >
                  <Meta
                    title={<Text strong>{product.productName}</Text>}
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
                        {product.material && (
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                            {t("category.material")}: {product.material}
                          </Text>
                        )}
                        <Button 
                          type="primary" 
                          block 
                          icon={<ShoppingCartOutlined />}
                          onClick={(e) => handleAddToCart(product, e)}
                          className="add-to-cart-btn"
                          style={{ marginTop: '8px' }}
                        >
                          {t("homepage.addToCart.button")}
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
      
      <Footer />
    </div>
  );
}

