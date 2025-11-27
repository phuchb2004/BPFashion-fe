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
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProductManagement from './product';
import OrderManagement from './order';
import UserManagement from './user';
import './style.css';
import { useTranslation } from 'react-i18next';

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDisplay, setIsDisplay] = useState('user');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDropdown = ({  key }) => {
    const paths = {
      profile: () => navigate('/profile'),
      homepage: () => navigate('/'),
      logout: () => handleLogout(),
    };
    if (paths[key]) {
      paths[key]();
    }
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t("dashboard.dropdown.profile"),
    },
    {
      key: 'homepage',
      icon: <HomeOutlined />,
      label: t("dashboard.dropdown.homepage"),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t("dashboard.dropdown.logout"),
    },
  ];

  const menuItems = [
    {
      key: 'user',
      icon: <UserOutlined />,
      label: 'Nhân viên',
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
    }
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
            menu={{ items: userMenuItems, onClick: handleDropdown }}
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
          {isDisplay === 'user' && <UserManagement />}
          {isDisplay === 'product' && <ProductManagement />}
          {isDisplay === 'order' && <OrderManagement />}
        </Content>
      </Layout>
    </Layout>
  );
}