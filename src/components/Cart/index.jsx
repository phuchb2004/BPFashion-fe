import React from "react";
import {
  Drawer,
  Button,
  List,
  Avatar,
  Typography,
  Space,
  Popconfirm,
  Empty,
} from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export default function Cart({
  open,
  onClose,
  cartItems,
  totalPrice,
  onCheckout,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const { t } = useTranslation();
  console.log("Dữ liệu giỏ hàng:", cartItems);
  
  return (
    <Drawer
      title={t("cart.title")}
      onClose={onClose}
      open={open}
      visible={open}
      width={400}
      footer={
        cartItems.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text strong>{t("cart.total")}:</Text>
              <Text strong type="danger" style={{ fontSize: 16 }}>
                {totalPrice.toLocaleString()} ₫
              </Text>
            </div>
            <Button
              type="primary"
              block
              size="large"
              style={{ background: "#e53935", border: "none" }}
              onClick={onCheckout}
            >
              {t("cart.checkout")}
            </Button>
          </div>
        )
      }
    >
      {cartItems.length === 0 ? (
        <Empty description={t("cart.empty")} />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Space key="actions" size="small">
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() =>
                      onUpdateQuantity(item.cartItemId, item.quantity - 1)
                    }
                  />
                  <Text>{item.quantity}</Text>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      onUpdateQuantity(item.cartItemId, item.quantity + 1)
                    }
                  />
                </Space>,
                <Popconfirm
                  key="delete"
                  title={t("cart.remove.title")}
                  onConfirm={() => onRemoveItem(item.cartItemId)}
                  okText={t("cart.remove.ok")}
                  cancelText={t("cart.remove.cancel")}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    size="small"
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size={64}
                    src={item.product.imageUrl || '/assets/logo2.png'}
                    style={{ borderRadius: 8 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/logo2.png';
                    }}
                  />
                }
                title={
                  <Text strong style={{ fontSize: 14 }}>
                    {item.product.productName}
                  </Text>
                }
                description={
                <>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.product.color} / {item.product.size}
                    </Text>
                    <br />
                    <Text strong type="danger">
                      {(item.product.price * item.quantity).toLocaleString()} ₫
                    </Text>
                    </>
                    }
                />
                </List.Item>
            )}
            />
        )}
    </Drawer>
    );
}
