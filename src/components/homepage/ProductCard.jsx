import React from "react";
import { Card, Typography, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import getProductImageUrl from "../../utils/productImageHelper";
import "./ProductCard.css";

const { Text } = Typography;
const { Meta } = Card;

const ProductCard = React.memo(({ product, onAddToCart, onViewProduct }) => {
  const { t } = useTranslation();

  const handleCardClick = () => {
    onViewProduct(product.productId);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return t("common.contact");
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <Card
      hoverable
      className="product-card"
      onClick={handleCardClick}
      cover={
        <div className="product-image-container">
          <img
            alt={product.productName}
            src={getProductImageUrl(product)}
            className="product-image"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/logo2.png";
            }}
          />
        </div>
      }
    >
      <Meta
        title={<Text className="product-name">{product.productName}</Text>}
        description={
          <div className="product-info">
            <Text className="current-price">{formatPrice(discountedPrice)}</Text>
            {product.discount > 0 && (
              <Text delete className="original-price">{formatPrice(product.price)}</Text>
            )}
          </div>
        }
      />
      <Button type="primary" block className="add-to-cart-btn" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}> {t("homepage.addToCart.button")} </Button>
    </Card>
  );
});

export default ProductCard;