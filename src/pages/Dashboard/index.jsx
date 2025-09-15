import React, { useState } from 'react';
import { 
  Layout, Menu, Button, Avatar, Dropdown, 
  Row, Col, Card, Statistic, Progress, Table, Tag 
} from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ProductOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import './style.css';

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDisplay, setIsDisplay] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
      key: 'product',
      icon: <ProductOutlined />,
      label: 'Sản phẩm',
    },
    {
      key: 'order',
      icon: <ShoppingOutlined />,
      label: 'Đơn hàng',
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: 'Nhân viên',
    },
  ];

  // Dữ liệu mẫu cho dashboard
  const dashboardData = {
    totalSales: 12540000,
    totalOrders: 284,
    totalProducts: 56,
    totalUsers: 128,
    salesGrowth: 12.5,
    orderGrowth: 8.3,
    recentOrders: [
      {
        id: 1001,
        customer: 'Nguyễn Văn A',
        amount: 1250000,
        status: 'Completed',
        date: '2023-10-20'
      },
      {
        id: 1002,
        customer: 'Trần Thị B',
        amount: 850000,
        status: 'Processing',
        date: '2023-10-20'
      },
      {
        id: 1003,
        customer: 'Lê Văn C',
        amount: 450000,
        status: 'Pending',
        date: '2023-10-19'
      },
      {
        id: 1004,
        customer: 'Phạm Thị D',
        amount: 2100000,
        status: 'Completed',
        date: '2023-10-19'
      },
      {
        id: 1005,
        customer: 'Hoàng Văn E',
        amount: 680000,
        status: 'Completed',
        date: '2023-10-18'
      }
    ],
    topProducts: [
      {
        id: 1,
        name: 'Áo thun nam cao cấp',
        sales: 42,
        stock: 15
      },
      {
        id: 2,
        name: 'Quần jean nữ ống rộng',
        sales: 38,
        stock: 8
      },
      {
        id: 3,
        name: 'Giày thể thao nam',
        sales: 35,
        stock: 12
      },
      {
        id: 4,
        name: 'Túi xách nữ da thật',
        sales: 28,
        stock: 5
      },
      {
        id: 5,
        name: 'Áo khoác nam dù',
        sales: 25,
        stock: 10
      }
    ]
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Cột cho bảng đơn hàng gần đây
  const recentOrdersColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => `${amount.toLocaleString('vi-VN')}₫`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = status === 'Completed' ? 'green' : status === 'Processing' ? 'blue' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    }
  ];

  // Cột cho bảng sản phẩm bán chạy
  const topProductsColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đã bán',
      dataIndex: 'sales',
      key: 'sales',
      render: sales => `${sales} sản phẩm`
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: stock => (
        <Progress 
          percent={(stock / 50) * 100} 
          size="small" 
          status={stock > 10 ? 'active' : stock > 5 ? 'normal' : 'exception'} 
          format={percent => `${stock}`}
        />
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h2 style={{ color: 'white', textAlign: 'center', padding: '10px' }}>
            {collapsed ? 'QT' : 'Trang Quản Trị'}
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[isDisplay]}
          items={menuItems}
          onClick={({ key }) => setIsDisplay(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <div style={{ marginRight: 16, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <span>{user.fullName || 'Admin'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            overflow: 'auto'
          }}
        >
          {isDisplay === 'product' && <ProductManagement />}
          {isDisplay === 'order' && <OrderManagement />}
          {isDisplay === 'user' && <UserManagement />}
          {isDisplay === 'dashboard' && (
            <div>
              <h1>Dashboard Overview</h1>
              <p style={{ marginBottom: 24 }}>Welcome to the admin dashboard. Here's an overview of your store performance.</p>
              
              {/* Thống kê tổng quan */}
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Sales"
                      value={dashboardData.totalSales}
                      precision={0}
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<DollarOutlined />}
                      suffix="₫"
                    />
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      <RiseOutlined style={{ color: '#3f8600', marginRight: 4 }} />
                      <span style={{ color: '#3f8600' }}>{dashboardData.salesGrowth}%</span> vs last month
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Orders"
                      value={dashboardData.totalOrders}
                      valueStyle={{ color: '#1890ff' }}
                      prefix={<ShoppingCartOutlined />}
                    />
                    <div style={{ marginTop: 8, fontSize: 12 }}>
                      <RiseOutlined style={{ color: '#3f8600', marginRight: 4 }} />
                      <span style={{ color: '#3f8600' }}>{dashboardData.orderGrowth}%</span> vs last month
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Products"
                      value={dashboardData.totalProducts}
                      valueStyle={{ color: '#722ed1' }}
                      prefix={<ProductOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Users"
                      value={dashboardData.totalUsers}
                      valueStyle={{ color: '#cf1322' }}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
              
              <Card title="Recent Orders" style={{ marginBottom: 24 }}>
                <Table 
                  columns={recentOrdersColumns} 
                  dataSource={dashboardData.recentOrders} 
                  size="middle"
                  pagination={{ pageSize: 5 }}
                  rowKey="id"
                />
              </Card>
              
              <Card title="Top Selling Products">
                <Table 
                  columns={topProductsColumns} 
                  dataSource={dashboardData.topProducts} 
                  size="middle"
                  pagination={{ pageSize: 5 }}
                  rowKey="id"
                />
              </Card>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}