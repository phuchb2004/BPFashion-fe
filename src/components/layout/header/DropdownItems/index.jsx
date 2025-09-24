import {
  UserOutlined,
  SolutionOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  EyeOutlined
} from '@ant-design/icons';

export const adminDropdown = [
  {
    label: "Tài khoản của tôi",
    key: 'profile',
    icon: <UserOutlined />
  },
  {
    label: "Quản lý",
    key: 'admin',
    icon: <EyeOutlined />
  },
  {
    label: "Đơn hàng",
    key: 'orders',
    icon: <SolutionOutlined />
  },
  {
    type: 'divider'
  },
  {
    label: "Đăng xuất",
    key: 'logout',
    icon: <LogoutOutlined />
  } 
];

export const userDropdown = [
  {
    label: "Tài khoản của tôi",
    key: 'profile',
    icon: <UserOutlined />
  },
  {
    label: "Đơn hàng",
    key: 'orders',
    icon: <SolutionOutlined />
  },
  {
    type: 'divider'
  },
  {
    label: "Đăng xuất",
    key: 'logout',
    icon: <LogoutOutlined />
  }  
];

export const notLoginDropdown = [
  {
    label: "Đăng nhập",
    key: "login",
    icon: <LoginOutlined />
  },
  {
    label: "Đăng ký",
    key: "register",
    icon: <UserAddOutlined />
  }
]

export const shirtDropdown = [
  {
    label: "Áo sơ mi",
    key: 'ao-so-mi'
  },
  {
    label: "Áo phông",
    key: 'ao-phong'
  },
  {
    label: "Áo khoác",
    key: 'ao-khoac'
  }
]

export const pantDropdown = [
  {
    label: "Quần tây",
    key: 'quan-tay'
  },
  {
    label: "Quần short",
    key: 'quan-short'
  },
  {
    label: "Quần jeans",
    key: 'quan-jeans'
  }
]

export const accessoriesDropdown = [
  {
    label: "Đồ lót",
    key: 'do-lot'
  },
  {
    label: "Tất",
    key: 'tat'
  },
  {
    label: "Dây lưng",
    key: 'day-lung'
  },
  {
    label: "Ví da",
    key: 'vi-da'
  }
]