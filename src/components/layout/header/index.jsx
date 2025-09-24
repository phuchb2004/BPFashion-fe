import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import axiosSystem from "../../api/axiosSystem";
import Cart from "../Cart";
import {
    UserOutlined,
    ShoppingCartOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {
    Dropdown,
    Space,
    Badge,
    Avatar,
    notification
} from "antd";
import {
    adminDropdown,
    userDropdown,
    shirtDropdown,
    pantDropdown,
    accessoriesDropdown,
    notLoginDropdown
} from "./DropdownItems";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [open, setOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [userRole, setUserRole] = useState(null);

    const navigate = useNavigate();
    const [messageLogout, contextHolder] = notification.useNotification();

    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    const openNotification = (type, message, description) => {
        messageLogout[type]({
            message,
            description,
            placement: "topRight",
            duration: 2
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        setIsLoggedIn(token);
        setUserRole(role);

        if (token) {
            const userId = localStorage.getItem("userId");
            if (userId) {
                fetchCart(userId);
            }
        }
    }, []);

    const fetchCart = async (userId) => {
        try {
            const res = await axiosSystem.get(`/Cart/${userId}`);
            setCartItems(res.data || []);
        } catch (error) {
            console.log("Lỗi khi lấy giỏ hàng: ", error);
            setCartItems([]);
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axiosSystem.put(`/Cart/UpdateCart/${cartItemId}`, newQuantity, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setCartItems((prev) =>
                prev.map((item) =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            await axiosSystem.delete(`/Cart/DeleteItem/${cartItemId}`);
            setCartItems((prev) =>
                prev.filter((item) => item.cartItemId !== cartItemId)
            );
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };

    const handleDropdown = ({ key }) => {
        const paths = {
            login: () => navigate("/login"),
            register: () => navigate("/register"),
            logout: () => handleLogout(),
            profile: () => navigate("/profile"),
            orders: () => navigate("/profile?tab=orders"),
            admin: () => navigate("/dashboard"),
            "ao-so-mi": () => navigate("/shirts/so-mi"),
            "ao-phong": () => navigate("/shirts/ao-phong"),
            "ao-khoac": () => navigate("/shirts/ao-khoac"),
            "quan-tay": () => navigate("/pants/quan-tay"),
            "quan-short": () => navigate("/pants/quan-short"),
            "quan-jeans": () => navigate("/pants/quan-jeans"),
            "do-lot": () => navigate("/accessories/do-lot"),
            tat: () => navigate("/accessories/tat"),
            "day-lung": () => navigate("/accessories/day-lung"),
            "vi-da": () => navigate("/accessories/vi-da")
        };
        if (paths[key]) {
            paths[key]();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        openNotification("success", "Đăng xuất thành công!");
        setIsLoggedIn(false);
        setUserRole(null);
        setCartItems([]);
        navigate("/home-page");
    };

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.quantity * (item.Product?.price || 0),
        0
    );

    const handleCheckout = () => {
        if (!isLoggedIn) {
            openNotification("warning", "Vui lòng đăng nhập", "Bạn cần đăng nhập để thanh toán");
            navigate("/login");
            return;
        }
        navigate("/checkout", { state: { cartItems, totalPrice } });
        setOpen(false);
    };

    const getUserDropdown = () => {
        if (isLoggedIn) {
            if (userRole === "Admin") {
                return adminDropdown;
            }
            return userDropdown;
        }
        return notLoginDropdown;
    };

    return (
        <header className="topbar">
            {contextHolder}
            <div className="container">
                <a className="logo-section" href="/home-page">
                    <img src="/logo-new.png" alt="Logo" className="logo" />
                </a>

                <nav className="menu">
                    <a href="/home-page">Trang chủ</a>
                    <Dropdown 
                        menu={{ items: shirtDropdown, onClick: handleDropdown }} 
                        trigger={["hover"]}
                        overlayClassName="category-dropdown"
                    >
                        <a onClick={(e) => { e.preventDefault(); navigate("/shirts"); }}>Áo</a>
                    </Dropdown>
                    <Dropdown 
                        menu={{ items: pantDropdown, onClick: handleDropdown }} 
                        trigger={["hover"]}
                        overlayClassName="category-dropdown"
                    >
                        <a onClick={(e) => { e.preventDefault(); navigate("/pants"); }}>Quần</a>
                    </Dropdown>
                    <Dropdown 
                        menu={{ items: accessoriesDropdown, onClick: handleDropdown }} 
                        trigger={["hover"]}
                        overlayClassName="category-dropdown"
                    >
                        <a onClick={(e) => { e.preventDefault(); navigate("/accessories"); }}>Phụ kiện</a>
                    </Dropdown>
                </nav>

                <div className="right-section">
                    <div className="search-box">
                        <SearchOutlined className="search-icon" />
                        <input type="text" placeholder="Tìm kiếm..." />
                    </div>

                    <div className="profile">
                        <Dropdown
                            menu={{ items: getUserDropdown(), onClick: handleDropdown }}
                            trigger={["hover", "click"]}
                            placement="bottomRight"
                            overlayClassName="user-dropdown"
                        >
                            <a onClick={(e) => e.preventDefault()} className="no-effect">
                                <Space>
                                    <Badge>
                                        <Avatar shape="circle" icon={<UserOutlined />} />
                                    </Badge>
                                </Space>
                            </a>
                        </Dropdown>
                    </div>

                    <div className="cart">
                        <Space aria-label="cart">
                            <Badge count={totalQuantity} size="small" offset={[0, 5]}>
                                <ShoppingCartOutlined
                                    onClick={showDrawer}
                                    style={{ fontSize: "20px", cursor: "pointer" }}
                                />
                            </Badge>
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
                    </div>
                </div>
            </div>
        </header>
    );
}