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
            
            const cartData = Array.isArray(res) ? res : res?.data || res || [];
            const mappedCartItems = cartData.map(item => ({
                cartItemId: item.cartItemId,
                variantId: item.variantId,
                quantity: item.quantity,
                product: {
                    productName: item.ProductVariant?.productName || item.ProductVariant?.Product?.productName || 'Tên sản phẩm',
                    imageUrl: item.ProductVariant?.imageUrl || item.ProductVariant?.Product?.imageUrl || '',
                    price: item.ProductVariant?.price || 0,
                    color: item.ProductVariant?.Color || item.ProductVariant?.colorName || '',
                    size: item.ProductVariant?.Size || item.ProductVariant?.sizeName || '',
                }
            }));
            
            setCartItems(mappedCartItems);
        } catch (error) {
            console.log("Lỗi khi lấy giỏ hàng: ", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

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
            
            const userId = localStorage.getItem("userId");
            if (userId) {
                fetchCart(userId);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
            const errorMsg = error.response?.data?.message || "Không thể cập nhật số lượng";
            showError("Lỗi", errorMsg);
            
            const userId = localStorage.getItem("userId");
            if (userId) {
                fetchCart(userId);
            }
        }
    }, [fetchCart]);

    const removeItem = useCallback(async (cartItemId) => {
        try {
            await baseApi.delete(`/Cart/DeleteItem/${cartItemId}`);
            
            setCartItems((prev) =>
                prev.filter((item) => item.cartItemId !== cartItemId)
            );
            
            const userId = localStorage.getItem("userId");
            if (userId) {
                fetchCart(userId);
            }
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            const errorMsg = error.response?.data?.message || "Không thể xóa sản phẩm";
            showError("Lỗi", errorMsg);
            
            const userId = localStorage.getItem("userId");
            if (userId) {
                fetchCart(userId);
            }
        }
    }, [fetchCart]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetchCart(userId);
        } else {
            setCartItems([]);
        }

        const handleCartUpdate = () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
                fetchCart(userId);
            } else {
                setCartItems([]);
            }
        };
        
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
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
        updateQuantity,
        removeItem,
        clearCart: () => setCartItems([])
    };
};

