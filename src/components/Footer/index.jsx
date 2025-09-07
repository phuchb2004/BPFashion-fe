import React from 'react';
import "./style.css";
import { 
    Button,
    Input
} from 'antd';
import { 
    FacebookOutlined,
    InstagramOutlined,
    TwitterOutlined,
    SearchOutlined
} from '@ant-design/icons';

export default function Footer() {

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h1>BP Fashion</h1>
                    <h4>
                        CÔNG TY CỔ PHẦN THỜI TRANG BPFASHION VIỆT NAM <br/>
                        Hotline: 1900 1000 <br/>
                        8:30 - 19:00 tất cả các ngày trong tuần
                    </h4>
                    <p><b>VP Phía Bắc:</b> Tầng 5 tòa nhà The Nine, số 9 Phạm Văn Đồng, Mai Dịch, Phú Diễn, Hà Nội</p>
                    <p><b>VP Phía Nam:</b> Tầng 6 tòa nhà Landmark 81, Tân Cảng, Bình Thạnh, TP.HCM</p>
                </div>

                <div className="footer-column">
                    <h3>Liên hệ</h3>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/react" target="_blank" rel="noreferrer">
                            <FacebookOutlined />
                        </a>
                        <a href="https://www.instagram.com/reactjsofficial/?hl=en" target="_blank" rel="noreferrer">
                            <InstagramOutlined />
                        </a>
                        <a href="https://x.com/reactjs" target="_blank" rel="noreferrer">
                            <TwitterOutlined />
                        </a>
                    </div>
                </div>

                <div className="footer-column">
                    <h3>Hỗ trợ</h3>
                    <ul className="support-section">
                        <li><a href="/return-policy">Chính sách đổi trả</a></li>
                        <li><a href="/privacy-policy">Chính sách bảo mật</a></li>
                        <li><a href="/terms-of-service">Điều khoản dịch vụ</a></li>
                    </ul>
                </div>

                <div className="footer-column newsletter">
                    <h3>Đăng ký nhận tin</h3>
                    <form>
                        <Input placeholder="Nhập email của bạn"/>
                        <Button type="primary">Gửi</Button>
                    </form>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 BP Fashion. All rights reserved.</p>
            </div>
        </footer>
    );
}