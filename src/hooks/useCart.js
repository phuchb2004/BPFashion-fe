import { useState, useEffect, useCallback } from 'react';
import baseApi from '../api/baseApi';
import { showError } from '../utils/notification';

export const useCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async (userId) => {
        if (!userId) {
            setCartItems([]);
            return;
        }

        setLoading(true);
        try {
            const res = await baseApi.get(`/Cart/${userId}`);
            
            const cartData = Array.isArray(res) ? res : [];
            setCartItems(cartData); 

        } catch (error) {
            console.log("Lỗi khi lấy giỏ hàng: ", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const removeItem = useCallback(async (cartItemId) => {
        try {
            await baseApi.delete(`/Cart/DeleteItem/${cartItemId}`);
            
            setCartItems((prev) =>
                prev.filter((item) => item.cartItemId !== cartItemId)
            );
            const userId = localStorage.getItem("userId");
            if (userId) fetchCart(userId);

        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            const errorMsg = error.response?.data?.message || "Không thể xóa sản phẩm";
            showError("Lỗi", errorMsg);
        }
    }, [fetchCart]);

    const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            await removeItem(cartItemId);
            return;
        }
        
        try {
            await baseApi.put(`/Cart/UpdateCart/${cartItemId}`, newQuantity);
            setCartItems((prev) =>
                prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
            
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
            const errorMsg = error.response?.data?.message || "Không thể cập nhật số lượng";
            showError("Lỗi", errorMsg);
            const userId = localStorage.getItem("userId");
            if (userId) fetchCart(userId);
        }
    }, [fetchCart, removeItem]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetchCart(userId);
        } else {
            setCartItems([]);
        }

        const handleCartUpdate = () => {
            const currentUserId = localStorage.getItem("userId");
            if (currentUserId) {
                fetchCart(currentUserId);
            }
        };
        
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [fetchCart]);

    const refetchCart = useCallback(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetchCart(userId);
        }
    }, [fetchCart]);

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price || 0),
        0
    );

    return {
        cartItems,
        loading,
        totalQuantity,
        totalPrice,
        fetchCart,
        refetchCart,
        updateQuantity,
        removeItem,
        clearCart: () => setCartItems([])
    };
};