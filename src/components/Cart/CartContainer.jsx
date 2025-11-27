import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge, Space, notification } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../../hooks/useCart';
import Cart from './index';

export default function CartContainer({ isLoggedIn }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [api, contextHolder] = notification.useNotification();
    
    const {
        cartItems,
        totalQuantity,
        totalPrice,
        refetchCart,
        updateQuantity,
        removeItem
    } = useCart();

    useEffect(() => {
        const handleCartUpdate = () => {
            refetchCart();
        };
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [refetchCart]);

    const showDrawer = () => {
        if (isLoggedIn) {
            refetchCart();
        }
        setOpen(true);
    };
    const onClose = () => setOpen(false);

    const openNotification = (type, message, description) => {
        api[type]({
            message,
            description,
            placement: "topRight",
            duration: type === 'success' ? 2.5 : 3.5
        });
    };

    const handleCheckout = () => {
        if (!isLoggedIn) {
            openNotification("warning", "Vui lòng đăng nhập", "Bạn cần đăng nhập để thanh toán");
            navigate("/login", { state: { from: location } });
            return;
        }
        navigate("/checkout", { state: { cartItems, totalPrice } });
        setOpen(false);
    };

    return (
        <>
            {contextHolder}
            <Space aria-label="cart">
                <span onClick={showDrawer} style={{ cursor: "pointer", display: 'inline-block' }}>
                    <Badge count={totalQuantity} size="small" offset={[0, 5]}>
                        <ShoppingCartOutlined
                            onClick={showDrawer}
                            style={{ fontSize: "20px", cursor: "pointer" }}
                        />
                    </Badge>
                </span>
                <Cart
                    open={open}
                    onClose={onClose}
                    cartItems={cartItems}
                    totalPrice={totalPrice}
                    onCheckout={handleCheckout}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    isLoggedIn={isLoggedIn}
                />
            </Space>
        </>
    );
}
