import React from "react";
import { Typography, Divider, Card } from "antd";
import "./style.css";
import Header from "../layout/header";
import Footer from "../layout/footer";

const { Title, Paragraph } = Typography;

export default function PrivacyPolicy() {
  return (
    <div className="policy-container">
        <Header/>
      <Card className="policy-card">
        <Title level={1} className="policy-title">Chính sách Bảo mật</Title>
        <Divider />
        
        <Title level={2}>1. Thu thập thông tin</Title>
        <Paragraph>
          Chúng tôi thu thập thông tin cá nhân khi bạn đăng ký tài khoản, đặt hàng, 
          liên hệ với chúng tôi hoặc tham gia các chương trình khuyến mãi. 
          Thông tin thu thập bao gồm: họ tên, email, số điện thoại, địa chỉ giao hàng.
        </Paragraph>
        
        <Title level={2}>2. Sử dụng thông tin</Title>
        <Paragraph>
          Thông tin cá nhân được sử dụng để:
          <br />- Xử lý đơn hàng và giao dịch
          <br />- Cung cấp dịch vụ hỗ trợ khách hàng
          <br />- Gửi thông tin khuyến mãi, cập nhật sản phẩm mới (nếu bạn đồng ý)
          <br />- Cải thiện trải nghiệm mua sắm
        </Paragraph>
        
        <Title level={2}>3. Bảo vệ thông tin</Title>
        <Paragraph>
          Chúng tôi sử dụng các biện pháp bảo mật như mã hóa SSL để bảo vệ thông tin cá nhân 
          của bạn khỏi truy cập trái phép, sử dụng hoặc tiết lộ.
        </Paragraph>
        
        <Title level={2}>4. Chia sẻ thông tin</Title>
        <Paragraph>
          Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba 
          mà không có sự đồng ý của bạn, ngoại trừ các trường hợp cần thiết để cung cấp dịch vụ 
          (đơn vị vận chuyển, đối tác thanh toán) hoặc theo yêu cầu pháp luật.
        </Paragraph>
        
        <Title level={2}>5. Quyền của bạn</Title>
        <Paragraph>
          Bạn có quyền:
          <br />- Truy cập và chỉnh sửa thông tin cá nhân
          <br />- Yêu cầu xóa tài khoản
          <br />- Ngừng nhận thông tin marketing
          <br />- Khiếu nại về việc xử lý dữ liệu
        </Paragraph>
        
        <div className="policy-contact">
          <Title level={3}>Liên hệ</Title>
          <Paragraph>
            Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:
            <br />- Bộ phận bảo mật: phuchb04@gmail.com
            <br />- Hotline: 1900 1000
          </Paragraph>
        </div>
      </Card>
        <Footer/>
    </div>
  );
}