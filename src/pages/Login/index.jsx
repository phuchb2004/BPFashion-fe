import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'
import axiosSystem from '../../api/axiosSystem';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { 
    Input,
    Button
} from 'antd';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem("token");
        if (email) {
            navigate("/home-page");
        }
    }, [navigate]);

    const handleValidate = () => {
        if (!email.trim()) {
            alert("Email không được để trống");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Email không hợp lệ");
            return false;
        }
        if (!password) {
            alert("Password không được để trống");
            return false;
        }
        return true;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!handleValidate()) return;

        try {
            const res = await axiosSystem.post('/Users/Login', {email, password});

            if (res.user.userId) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("userId", res.user.userId);
                localStorage.setItem("email", res.user.email);
                localStorage.setItem("password", res.user.password);
                localStorage.setItem("role", res.user.role);
                navigate("/home-page");
            }
            else {
                alert("Khong tim thay thong tin user");
            }
        }
        catch (error) {
            console.log('Đăng nhập xảy ra lỗi',error);
            alert("Sai email hoặc mật khẩu");
        }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log("GG user info", decoded);

            const res = await axiosSystem.post("/LoginGoogle", {
                credential: credentialResponse.credential,
            });

            const { token, user } = res.data;
            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("email", user.email);
                localStorage.setItem("role", user.role);
            }

            alert("Đăng nhập Google thành công!");
            navigate("/home-page");
        }
        catch (error) {
            console.log("gg login error", error);
        }
    };

    const handleGoogleFailure = () => {
        alert("Đăng nhập Google thất bại");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-left">
                    <div className="overlay">
                        <h1>BP Fashion</h1>
                        <p>Thời trang nam phong cách</p>
                    </div>
                </div>

                <div className="login-right">
                    <h2>Đăng nhập</h2>
                    <p>
                        Nếu chưa có tài khoản, <a href="/register">đăng ký ngay</a>
                    </p>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <Input
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="primary" className="btn-login" onClick={handleLogin}>Đăng nhập</Button>

                        <div className="forgot-password">

                        </div>
                    </form>

                    <div className="social-login">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}