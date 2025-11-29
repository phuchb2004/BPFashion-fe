import {
  UserOutlined,
  SolutionOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons';

const flagStyle = {
  width: '22px',
  height: '22px',
  objectFit: 'cover',
  borderRadius: '50%',
  border: '1px solid #e5e7eb',
  display: 'block'
};

const icons = {
  vi: <img src="../../../../assets/vn-flag.jpg" alt="VN" style={flagStyle} />,
  en: <img src="../../../../assets/us-flag.jpg" alt="EN" style={flagStyle} />
};

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
      { label: t("header.dropdown.language_vi"), key: "lang:vi", icon: icons.vi },
      { label: t("header.dropdown.language_en"), key: "lang:en", icon: icons.en }
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
      { label: t("header.dropdown.language_vi"), key: "lang:vi", icon: icons.vi },
      { label: t("header.dropdown.language_en"), key: "lang:en", icon: icons.en }
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
      { label: t("header.dropdown.language_vi"), key: "lang:vi", icon: icons.vi },
      { label: t("header.dropdown.language_en"), key: "lang:en", icon: icons.en }
    ],
    icon: <SettingOutlined />
  }
];