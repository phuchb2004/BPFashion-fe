import React from "react";
import { Typography, Divider, Card } from "antd";
import "./style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const { Title, Paragraph } = Typography;

export default function ReturnPolicy() {
  return (
    <div className="policy-container">
      <Header/>
      <Card className="policy-card">
        <Title level={1} className="policy-title">Chính sách Đổi trả</Title>
        <Divider />
        
        <Title level={2}>1. Điều kiện đổi trả</Title>
        <Paragraph>
          Chúng tôi chấp nhận đổi trả sản phẩm trong vòng 30 ngày kể từ ngày mua hàng. 
          Sản phẩm phải còn nguyên tem, nhãn mác, chưa qua sử dụng và trong tình trạng nguyên vẹn như ban đầu.
        </Paragraph>
        
        <Title level={2}>2. Quy trình đổi trả</Title>
        <Paragraph>
          - Liên hệ bộ phận chăm sóc khách hàng qua hotline 1900 1000 hoặc email support@bpfashion.com
          <br />- Cung cấp thông tin đơn hàng và lý do đổi trả
          <br />- Nhân viên sẽ hướng dẫn bạn các bước tiếp theo
          <br />- Gửi sản phẩm về địa chỉ được cung cấp
        </Paragraph>
        
        <Title level={2}>3. Phí đổi trả</Title>
        <Paragraph>
          Miễn phí đổi trả đối với sản phẩm lỗi từ nhà sản xuất. Đối với đổi trả do khách hàng, 
          quý khách sẽ chịu phí vận chuyển hai chiều.
        </Paragraph>
        
        <Title level={2}>4. Thời gian xử lý</Title>
        <Paragraph>
          Thời gian xử lý yêu cầu đổi trả là 3-5 ngày làm việc kể từ khi nhận được sản phẩm.
        </Paragraph>
        
        <div className="policy-contact">
          <Title level={3}>Liên hệ</Title>
          <Paragraph>
            Mọi thắc mắc về chính sách đổi trả, vui lòng liên hệ:
            <br />- Hotline: 1900 1000
            <br />- Email: phuchb04@gmail.com
            <br />- Giờ làm việc: 8:30 - 19:00 các ngày trong tuần
          </Paragraph>
        </div>
      </Card>
      <Footer/>
    </div>
  );
}