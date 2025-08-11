import React, { useState } from "react";
import "./style.css";
import { ShoppingCart, Search, User } from "lucide-react";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <header className="topbar">
                <div className="container">
                    <div className="logo">BP Fashion</div>

                    <nav className="menu">
                        <a href="/home">Trang chủ</a>
                        <a href="/new-products">Hàng mới</a>
                        <a href="/male-shirts">Áo nam</a>
                        <a href="/male-pants">Quần nam</a>
                        <a href="/female-shirts">Áo nữ</a>
                        <a href="/female-pants">Quần nữ</a>
                        <a href="/accessories">Phụ kiện</a>
                    </nav>

                    <div className="right-section">
                        <div className="search-box">
                            <Search className="search-icon"/>
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>
                    </div>

                    <div className="cart">
                        <ShoppingCart className="cart-icon"/>
                        <span className="cart-count">3</span>
                    </div>

                    <div className="profile">
                        {isLoggedIn ? (
                            <div className="profile-container">
                                <div className="profile-icon" onClick={() => setShowMenu(!showMenu)}>
                                    <User/>
                                </div>

                                {showMenu && (
                                    <div className="profile-menu">
                                        <a href="/profile">Tài khoản của tôi</a>
                                        <a href="/orders">Đơn hàng</a>
                                        <button onClick={() => alert("Đăng xuất")}>Đăng xuất</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a className="login-btn" href="/login">Đăng nhập</a>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}