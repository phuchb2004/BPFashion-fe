import {
  UserOutlined,
  SolutionOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  EyeOutlined,
  SettingOutlined
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
    label: t("header.dropdown.language"),
    key: "language",
    children: [
      { label: t("header.dropdown.language_vi"), key: "lang:vi" },
      { label: t("header.dropdown.language_en"), key: "lang:en" }
    ],
    icon: <SettingOutlined />
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
    label: t("header.dropdown.language"),
    key: "language",
    children: [
      { label: t("header.dropdown.language_vi"), key: "lang:vi" },
      { label: t("header.dropdown.language_en"), key: "lang:en" }
    ],
    icon: <SettingOutlined />
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
  },
  {
    type: 'divider'
  },
  {
    label: t("header.dropdown.language"),
    key: "language",
    children: [
      { label: t("header.dropdown.language_vi"), key: "lang:vi" },
      { label: t("header.dropdown.language_en"), key: "lang:en" }
    ],
    icon: <SettingOutlined />
  }
];