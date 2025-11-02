import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";
import CartContainer from "../../cart/CartContainer";
import {
    UserOutlined,
    ShoppingCartOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {
    Dropdown,
    Badge,
    Avatar,
    notification,
    Space
} from "antd";
import {
    adminDropdown,
    userDropdown,
    notLoginDropdown
} from "./dropdown-items";
const logo = '/assets/logo-new.png';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [messageLogout, contextHolder] = notification.useNotification();

    const openNotification = (type, message, description) => {
        messageLogout[type]({
            message,
            description,
            placement: "topRight",
            duration: type === 'success' ? 2.5 : 3.5
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        setIsLoggedIn(!!token);
        setUserRole(role);
    }, []);

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const handleDropdown = ({ key }) => {
        const paths = {
            login: () => navigate("/login"),
            register: () => navigate("/register"),
            logout: () => handleLogout(),
            profile: () => navigate("/profile"),
            orders: () => navigate("/profile/orders"),
            admin: () => navigate("/dashboard")
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
        // Dispatch event to clear cart
        window.dispatchEvent(new Event('cartUpdated'));
        navigate("/homepage");
    };

    const getUserDropdown = () => {
        if (isLoggedIn) {
            if (userRole === "Admin") {
                return adminDropdown(t);
            }
            return userDropdown(t);
        }
        return notLoginDropdown(t);
    };

    return (
        <header className="topbar">
            {contextHolder}
            <div className="container">
                <nav className="menu left-menu">
                    <a href="/homepage" className="menu-link">
                        {t("header.menu.home")}
                    </a>
                    <a 
                        href="/shirts" 
                        className="menu-link"
                        onClick={(e) => {
                            e.preventDefault();
                            handleMenuClick("/shirts");
                        }}
                    >
                        {t("header.menu.shirts")}
                    </a>
                    <a 
                        href="/pants" 
                        className="menu-link"
                        onClick={(e) => {
                            e.preventDefault();
                            handleMenuClick("/pants");
                        }}
                    >
                        {t("header.menu.pants")}
                    </a>
                    <a 
                        href="/accessories" 
                        className="menu-link"
                        onClick={(e) => {
                            e.preventDefault();
                            handleMenuClick("/accessories");
                        }}
                    >
                        {t("header.menu.accessories")}
                    </a>
                </nav>
                
                <a className="logo-section" href="/homepage">
                    <img src={logo} alt="Logo" className="logo" />
                </a>
                
                <div className="right-section">
                    <div className="search-box">
                        <SearchOutlined className="search-icon" />
                        <input type="text" placeholder={t("header.search.placeholder")} />
                    </div>

                    <div className="profile">
                        <Dropdown
                            menu={{ items: getUserDropdown(), onClick: handleDropdown }}
                            trigger={["click"]}
                            placement="bottomRight"
                            overlayClassName="user-dropdown"
                            getPopupContainer={(triggerNode) => triggerNode.parentElement}
                        >
                            <span className="no-effect" style={{ cursor: 'pointer' }}>
                                <Avatar shape="circle" icon={<UserOutlined />} />
                            </span>
                        </Dropdown>
                    </div>

                    <div className="cart">
                        <CartContainer isLoggedIn={isLoggedIn} />
                    </div>
                </div>
            </div>
        </header>
    );
}