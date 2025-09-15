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
  return (
    <Drawer
      title="Giỏ hàng"
      onClose={onClose}
      open={open}
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
              <Text strong>TỔNG TIỀN:</Text>
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
              THANH TOÁN
            </Button>
          </div>
        )
      }
    >
      {cartItems.length === 0 ? (
        <Empty description="Chưa có sản phẩm nào trong giỏ hàng" />
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
                  title="Xóa sản phẩm?"
                  onConfirm={() => onRemoveItem(item.cartItemId)}
                  okText="Xóa"
                  cancelText="Hủy"
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
                    src={item.product.imageUrl}
                    style={{ borderRadius: 8 }}
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
