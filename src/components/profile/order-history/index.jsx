import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseApi from '../../../api/baseApi';
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import './style.css';
import { 
    UserOutlined,
    HomeOutlined,
    DropboxOutlined,
    EyeOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { 
    Menu,
    Card,
    Table,
    Tag,
    Button,
    Space,
    Modal,
    Descriptions,
    Empty,
    Spin,
    Image,
    List
} from 'antd';
import { showError } from '../../../utils/notification';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            showError('Vui lòng đăng nhập để xem đơn hàng.');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // Gọi API lấy đơn hàng theo userId
            const res = await baseApi.get(`/Orders/GetOrdersByUser/${userId}`);
            // Xử lý nhiều format response
            const ordersList = res?.data || res?.orders || res || [];
            setOrders(Array.isArray(ordersList) ? ordersList : []);
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
            const errorMsg = error.response?.data?.message || error.response?.message || 'Không thể tải danh sách đơn hàng!';
            showError('Không thể tải danh sách đơn hàng!', errorMsg);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const showOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const getStatusColor = (status) => {
        const statusMap = {
            'Pending': 'orange',
            'Processing': 'blue',
            'Shipped': 'cyan',
            'Delivered': 'green',
            'Cancelled': 'red',
            'Chờ xử lý': 'orange',
            'Đang xử lý': 'blue',
            'Đang giao': 'cyan',
            'Đã giao': 'green',
            'Đã hủy': 'red'
        };
        return statusMap[status] || 'default';
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(price);
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 120,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 120,
            render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 150,
            render: (price, record) => formatPrice(price || record.totalAmount || 0)
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status || 'Chờ xử lý'}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            render: (_, record) => (
                <Button 
                    type="link" 
                    icon={<EyeOutlined />}
                    onClick={() => showOrderDetails(record)}
                >
                    Xem chi tiết
                </Button>
            )
        }
    ];

    const menuItems = [
        { 
            key: 'profile', 
            icon: <UserOutlined/>, 
            label: 'Thông tin tài khoản',
            onClick: () => navigate('/profile')
        },
        { 
            key: 'address', 
            icon: <HomeOutlined />, 
            label: 'Quản lý địa chỉ',
            onClick: () => navigate('/profile/address')
        },
        { 
            key: 'orders', 
            icon: <DropboxOutlined />, 
            label: 'Quản lý đơn hàng',
            onClick: () => navigate('/profile/orders')
        }
    ];

    return (
        <div className="profile-container">
            <Header />
            <div className="profile-page">
                <aside className="profile-sidebar">
                    <Card className="sidebar-card">
                        <Menu
                            onClick={(e) => {
                                const item = menuItems.find(i => i.key === e.key);
                                if (item && item.onClick) item.onClick();
                            }}
                            selectedKeys={['orders']}
                            mode="inline"
                            items={menuItems}
                            className="profile-menu"
                        />
                    </Card>
                </aside>

                <main className="profile-content">
                    <Card className="content-card">
                        <div className="order-header">
                            <h2 className="page-title">Quản lý đơn hàng</h2>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={fetchOrders}
                                loading={loading}
                            >
                                Làm mới
                            </Button>
                        </div>

                        {loading ? (
                            <div className="loading-wrapper">
                                <Spin size="large" />
                            </div>
                        ) : orders.length === 0 ? (
                            <Empty description="Bạn chưa có đơn hàng nào" />
                        ) : (
                            <Table
                                columns={columns}
                                dataSource={orders}
                                rowKey="orderId"
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showTotal: (total) => `Tổng ${total} đơn hàng`
                                }}
                                scroll={{ x: 800 }}
                            />
                        )}
                    </Card>
                </main>
            </div>

            <Modal
                title={`Chi tiết đơn hàng #${selectedOrder?.orderId}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>
                ]}
                width={800}
            >
                {selectedOrder && (
                    <div>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Mã đơn hàng">
                                #{selectedOrder.orderId}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đặt">
                                {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString('vi-VN') : '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái" span={2}>
                                <Tag color={getStatusColor(selectedOrder.status)}>
                                    {selectedOrder.status || 'Chờ xử lý'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
                                {selectedOrder.shippingAddress || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phương thức thanh toán" span={2}>
                                {selectedOrder.paymentMethod || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng tiền" span={2}>
                                <strong style={{ fontSize: '18px', color: '#f97316' }}>
                                    {formatPrice(selectedOrder.totalPrice || selectedOrder.totalAmount || 0)}
                                </strong>
                            </Descriptions.Item>
                        </Descriptions>

                        {(selectedOrder.orderItems || selectedOrder.orderDetails) && 
                         (selectedOrder.orderItems?.length > 0 || selectedOrder.orderDetails?.length > 0) && (
                            <div style={{ marginTop: '24px' }}>
                                <h3>Sản phẩm</h3>
                                <Table
                                    dataSource={selectedOrder.orderItems || selectedOrder.orderDetails}
                                    rowKey={(record) => record.orderItemId || record.orderDetailId || record.productId}
                                    pagination={false}
                                    columns={[
                                        {
                                            title: 'Sản phẩm',
                                            key: 'product',
                                            render: (_, item) => {
                                                const product = item.product || {};
                                                const imageUrl = product.imageUrl || product.image || '';
                                                const productName = product.productName || product.name || '-';
                                                return (
                                                    <Space>
                                                        {imageUrl && (
                                                            <Image 
                                                                width={60} 
                                                                src={imageUrl} 
                                                                alt={productName}
                                                                preview={false}
                                                                fallback="/assets/logo2.png"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = '/assets/logo2.png';
                                                                }}
                                                            />
                                                        )}
                                                        <span>{productName}</span>
                                                    </Space>
                                                );
                                            }
                                        },
                                        {
                                            title: 'Số lượng',
                                            dataIndex: 'quantity',
                                            key: 'quantity',
                                            width: 100,
                                            align: 'center'
                                        },
                                        {
                                            title: 'Đơn giá',
                                            key: 'price',
                                            width: 150,
                                            render: (_, item) => formatPrice(item.priceAtPurchase || item.product?.price || 0)
                                        },
                                        {
                                            title: 'Thành tiền',
                                            key: 'total',
                                            width: 150,
                                            render: (_, item) => formatPrice(
                                                (item.priceAtPurchase || item.product?.price || 0) * (item.quantity || 0)
                                            )
                                        }
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            <Footer />
        </div>
    );
}

