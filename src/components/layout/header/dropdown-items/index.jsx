import {
  UserOutlined,
  SolutionOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  EyeOutlined
} from '@ant-design/icons';

export const adminDropdown = (t) => [
  {
    label: t("header.dropdown.profile"),
    key: 'profile',
    icon: <UserOutlined />
  },
  {
    label: t("header.dropdown.admin"),
    key: 'admin',
    icon: <EyeOutlined />
  },
  {
    label: t("header.dropdown.order"),
    key: 'orders',
    icon: <SolutionOutlined />
  },
  {
    type: 'divider'
  },
  {
    label: t("header.dropdown.logout"),
    key: 'logout',
    icon: <LogoutOutlined />
  } 
];

export const userDropdown = (t) => [
  {
    label: t("header.dropdown.profile"),
    key: 'profile',
    icon: <UserOutlined />
  },
  {
    label: t("header.dropdown.order"),
    key: 'orders',
    icon: <SolutionOutlined />
  },
  {
    type: 'divider'
  },
  {
    label: t("header.dropdown.logout"),
    key: 'logout',
    icon: <LogoutOutlined />
  }  
];

export const notLoginDropdown = (t) => [
  {
    label: t("header.dropdown.login"),
    key: "login",
    icon: <LoginOutlined />
  },
  {
    label: t("header.dropdown.register"),
    key: "register",
    icon: <UserAddOutlined />
  }
];

export const shirtDropdown = (t) => [
  {
    label: t("header.menu.dropdown.somi"),
    key: 'ao-so-mi'
  },
  {
    label: t("header.menu.dropdown.tshirt"),
    key: 'ao-phong'
  },
  {
    label: t("header.menu.dropdown.jacket"),
    key: 'ao-khoac'
  }
];

export const pantDropdown = (t) => [
  {
    label: t("header.menu.dropdown.dress-pant"),
    key: 'quan-tay'
  },
  {
    label: t("header.menu.dropdown.short"),
    key: 'quan-short'
  },
  {
    label: t("header.menu.dropdown.jeans"),
    key: 'quan-jeans'
  }
];

export const accessoriesDropdown = (t) => [
  {
    label: t("header.menu.dropdown.underwear"),
    key: 'do-lot'
  },
  {
    label: t("header.menu.dropdown.socks"),
    key: 'tat'
  },
  {
    label: t("header.menu.dropdown.belt"),
    key: 'day-lung'
  },
  {
    label: t("header.menu.dropdown.wallet"),
    key: 'vi-da'
  }
];