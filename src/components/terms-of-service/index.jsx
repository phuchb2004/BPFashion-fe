import React from "react";
import { Typography, Divider, Card } from "antd";
import "./style.css";
import Header from "../layout/header";
import Footer from "../layout/footer";

const { Title, Paragraph } = Typography;

export default function TermsOfService() {
  return (
    <div className="policy-container">
        <Header/>
      <Card className="policy-card">
        <Title level={1} className="policy-title">Điều khoản Dịch vụ</Title>
        <Divider />
        
        <Title level={2}>1. Giới thiệu</Title>
        <Paragraph>
          Chào mừng bạn đến với BP Fashion. Bằng việc truy cập và sử dụng website, 
          bạn đồng ý với các điều khoản và điều kiện được nêu dưới đây.
        </Paragraph>
        
        <Title level={2}>2. Đăng ký tài khoản</Title>
        <Paragraph>
          - Bạn phải từ đủ 18 tuổi trở lên hoặc có sự giám sát của người lớn khi sử dụng dịch vụ
          <br />- Cung cấp thông tin chính xác và đầy đủ khi đăng ký
          <br />- Bảo mật thông tin tài khoản và mật khẩu
          <br />- Chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của mình
        </Paragraph>
        
        <Title level={2}>3. Đặt hàng và thanh toán</Title>
        <Paragraph>
          - Giá sản phẩm được hiển thị trên website là giá đã bao gồm VAT
          <br />- Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong một số trường hợp
          <br />- Thanh toán được thực hiện thông qua các cổng thanh toán an toàn
        </Paragraph>
        
        <Title level={2}>4. Quyền sở hữu trí tuệ</Title>
        <Paragraph>
          Mọi nội dung trên website bao gồm logo, hình ảnh, văn bản đều là tài sản của BP Fashion 
          và được bảo vệ bởi luật sở hữu trí tuệ. Bạn không được phép sử dụng mà không có sự cho phép.
        </Paragraph>
        
        <Title level={2}>5. Giới hạn trách nhiệm</Title>
        <Paragraph>
          Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng website 
          hoặc không thể truy cập website, bao gồm nhưng không giới hạn ở thiệt hại trực tiếp, gián tiếp.
        </Paragraph>
        
        <Title level={2}>6. Thay đổi điều khoản</Title>
        <Paragraph>
          Chúng tôi có quyền thay đổi các điều khoản này vào bất kỳ thời điểm nào. 
          Việc tiếp tục sử dụng website sau khi có thay đổi được xem như chấp nhận các điều khoản mới.
        </Paragraph>
        
        <div className="policy-contact">
          <Title level={3}>Liên hệ</Title>
          <Paragraph>
            Mọi thắc mắc về điều khoản dịch vụ, vui lòng liên hệ:
            <br />- Email: phuchb04@gmail.com
            <br />- Hotline: 1900 1000
          </Paragraph>
        </div>
      </Card>
      <Footer/>
    </div>
  );
}