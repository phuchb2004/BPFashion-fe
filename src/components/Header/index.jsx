import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { Search } from "lucide-react";
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { UserOutlined } from '@ant-design/icons';
import { 
    Dropdown, 
    Space,
    Badge,
    Avatar
} from 'antd';
import { 
    avatarDropdown,
    shirtDropdown,
    pantDropdown,
    accessoriesDropdown,
    goodPriceDropdown,
    notLoginDropdown
} from "./DropdownItems";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(token);
    }, [])
    
    const handleMenuClick = ({key}) => {
        switch (key) {
            case 'login':
                navigate("/login");
                break;
            case 'register':
                navigate("/register");
                break;
            //avatar
            case 'logout':
                handleLogout();
                break;
            case 'profile':
                navigate("/profile");
                break;
            case 'orders':
                navigate("/orders");
                break;
            //shirts
            case 'ao-so-mi':
                navigate("/shirts/so-mi");
                break;
            case 'ao-phong':
                navigate("/shirts/ao-phong");
                break;
            case 'ao-khoac':
                navigate("/shirts/ao-khoac");
                break;
            case 'ao-len':
                navigate("/shirts/ao-len");
                break;
            //pants
            case 'quan-tay':
                navigate("/pants/quan-tay");
                break;
            case 'quan-short':
                navigate("/pants/quan-short");
                break;
            case 'quan-jeans':
                navigate("/pants/quan-jeans");
                break;
            case 'quan-ni':
                navigate("/pants/quan-ni");
                break;
            //accessories
            case 'do-lot':
                navigate("/accessories/do-lot");
                break;
            case 'tat':
                navigate("/accessories/tat");
                break;
            case 'day-lung':
                navigate("/accessories/day-lung");
                break;
            case 'vi-da':
                navigate("/accessories/vi-da");
                break;
            case 'ca-vat':
                navigate("/accessories/ca-vat");
                break;
            //good-price
            case 'so-mi-gp':
                navigate("/good-price/so-mi-gp");
                break;
            case 'polo-tshirt-gp':
                navigate("/good-price/polo-tshirt-gp");
                break;
            case 'pant-gp':
                navigate("/good-price/pant-gp");
                break;
            case 'special-offers-gp':
                navigate("/good-price/special-offers-gp");
                break;
            default:
                break;
        }
    };

    const handleCartNavigate = () => {
        navigate("/cart");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        alert("Đăng xuất");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <>
            <header className="topbar">
                <div className="container">
                    <a className="logo-section" href="/home-page">
                        <img src="/logo-new.png" alt="Logo" className="logo"/>
                    </a>

                    <nav className="menu">
                        <a href="/home-page">Trang chủ</a>
                        <a href="/new-products">Hàng mới</a>
                        <Dropdown menu={{ items: shirtDropdown, onClick: handleMenuClick}} trigger={['hover']} placement="bottom">
                            <a onClick={(e) => {
                                e.preventDefault();
                                navigate("/shirts")
                            }}>Áo</a>
                        </Dropdown>
                        <Dropdown menu={{ items: pantDropdown, onClick: handleMenuClick }} trigger={['hover']} placement="bottom">
                            <a onClick={(e) => {
                                e.preventDefault();
                                navigate("/pants")
                            }}>Quần</a>
                        </Dropdown>
                        <Dropdown menu={{ items: accessoriesDropdown, onClick: handleMenuClick }} trigger={['hover']} placement="bottom">
                            <a onClick={(e) => {
                                e.preventDefault();
                                navigate("/accessories")
                            }}>Phụ kiện</a>
                        </Dropdown>
                        <Dropdown menu={{ items: goodPriceDropdown, onClick: handleMenuClick }} trigger={['hover']} placement="bottom">
                            <a onClick={(e) => {
                                e.preventDefault();
                                navigate("/good-price")
                            }}>Giá tốt</a>
                        </Dropdown>
                        <a href="/branch">Cửa hàng</a>
                    </nav>

                    <div className="right-section">
                        <div className="search-box">
                            <Search className="search-icon"/>
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>

                        <div className="cart">
                            <IconButton aria-label="cart" onClick={handleCartNavigate}>
                                <Badge>
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
                        </div> 

                        <div className="profile">
                            {isLoggedIn ? (
                                <div className="profile-container">
                                    <div className="profile-icon">
                                        <Dropdown menu={{ items: avatarDropdown, onClick: handleMenuClick }} trigger={['hover']}>
                                            <a onClick={e => e.preventDefault()} className="no-effect">
                                                <Space>
                                                    <Badge>
                                                        <Avatar shape="circle" icon={<UserOutlined />} />
                                                    </Badge>
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    </div>
                                </div>
                            ) : (
                                <div className="profile-container">
                                    <div className="profile-icon">
                                        <Dropdown menu={{ items: notLoginDropdown, onClick: handleMenuClick }} trigger={['hover']}>
                                            <a onClick={e => e.preventDefault()} className="no-effect">
                                                <Space>
                                                    <Badge>
                                                        <Avatar shape="circle" icon={<UserOutlined/>}/>
                                                    </Badge>
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    </div>
                                </div>
                            )}
                        </div>                                               
                    </div>
                </div>
            </header>
        </>
    );
}