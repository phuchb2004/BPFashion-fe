import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layout/header";
import Footer from "../layout/footer";
import {
  Row, Col, Card, Spin, Empty, Typography, Tabs,
  Button, Tag, notification, Breadcrumb, Input
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
        <Breadcrumb
          items={[
            { title: <HomeOutlined />, onClick: () => navigate("/homepage") },
            { title: 'Áo' },
          ]}
          style={{ cursor: "pointer"}}
        />
      </div>

      <div className="page-content">
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
        ) : products.length === 0 ? (
          <Empty description="Không có sản phẩm nào" />
        ) : (
          <Row gutter={[24, 32]} className="products-grid">
            {products.map((product) => (
              <Col key={product.productId} xs={12} sm={8} md={6} lg={6}>
                <Card
                  hoverable
                  className="product-card"
                  onClick={() => navigate(`/product/${product.productId}`)}
                  cover={
                    <div className="product-image-container">
                      <img
                        alt={product.productName}
                        src={product.imageUrl}
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
      </div>
      
      <Footer />
    </div>
  );
}