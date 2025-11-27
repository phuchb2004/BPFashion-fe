import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.css";
import CartContainer from "../../cart/CartContainer";
import {
    UserOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {
    Dropdown,
    Avatar,
    notification,
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
    const { t, i18n } = useTranslation();
    const [dropdownVisible, setDropdownVisible] = useState(false);

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

    useEffect(() => {
        try {
            document.documentElement.lang = i18n.language || 'vi';
        } catch { void 0; }
    }, [i18n.language]);

    const handleMenuClick = (path) => {
        navigate(path);
    };

    const handleDropdown = ({ key }) => {
        if (key && key.startsWith('lang:')) {
            const lng = key.split(':')[1];
            i18n.changeLanguage(lng);
            try {
                localStorage.setItem('i18nextLng', lng);
                document.documentElement.lang = lng;
            } catch { void 0; }
            return;
        }
        
        const paths = {
            login: () => navigate("/login"),
            register: () => navigate("/register"),
            logout: () => handleLogout(),
            profile: () => navigate("/profile"),
            orders: () => navigate("/profile/orders"),
            admin: () => navigate("/dashboard")
        };

        if (paths[key]) paths[key]();
        setDropdownVisible(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        openNotification("success", "Đăng xuất thành công!");
        setIsLoggedIn(false);
        setUserRole(null);
        window.dispatchEvent(new Event('cartUpdated'));
        navigate("/homepage");
    };

    const getDropdownItems = () => {
        if (!isLoggedIn) {
            return notLoginDropdown(t);
        }
        return userRole === "Admin" ? adminDropdown(t) : userDropdown(t);
    };
    const userDropdownItems = getDropdownItems();

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
                            menu={{ items: userDropdownItems, onClick: handleDropdown, expandIcon: null, triggerSubMenuAction: 'click' }}
                            trigger={["click"]}
                            open={dropdownVisible}
                            onOpenChange={setDropdownVisible}
                            placement="bottomRight"
                            overlayClassName="user-dropdown"
                        >
                            <span style={{ cursor: 'pointer', display: 'inline-block' }}>
                                <Avatar
                                    className="profile"
                                    shape="circle"
                                    icon={<UserOutlined />}
                                />
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