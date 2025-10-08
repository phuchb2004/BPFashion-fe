import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Descriptions, Select, message, Card } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axiosSystem from '../../../api/axiosSystem';
import '../common/style.css'; // Sử dụng CSS chung

const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosSystem.get('/Orders/GetAllOrders');
      setOrders(response || []);
    } catch (error) {
      message.error('Lấy dữ liệu đơn hàng thất bại!', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Cập nhật trạng thái trong dữ liệu mẫu
      const updatedOrders = orders.map(order => 
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      message.success('Order status updated successfully');
      
      // Nếu muốn gọi API thật, bỏ comment dòng dưới
      // await axiosSystem.put(`/Orders/UpdateOrderStatus/${orderId}`, { status: newStatus });
    } catch (error) {
      message.error('Failed to update order status');
      console.error(error);
    }
  };

  const columns = [
    { title: 'Mã ĐH', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Khách hàng', dataIndex: 'userName', key: 'userName' },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `₫${parseFloat(amount).toLocaleString('vi-VN')}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Completed') color = 'success';
        else if (status === 'Pending') color = 'warning';
        else if (status === 'Cancelled') color = 'error';
        else if (status === 'Processing') color = 'processing';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => showOrderDetails(record)}>
            Xem
          </Button>
          <Select
            defaultValue={record.status}
            style={{ width: 130 }}
            onChange={(value) => handleStatusChange(record.orderId, value)}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Space>
      ),
    },
  ];

  return (
    <div className='dashboard-page-container'>
      <div className="dashboard-page-header">
          <h2>Quản lý Đơn hàng</h2>
      </div>
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="orderId"
        />
      </Card>
      <Modal
        title={`Order Details - #${selectedOrder?.orderId}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Customer">{selectedOrder.userName}</Descriptions.Item>
            <Descriptions.Item label="Order Date">
              {new Date(selectedOrder.orderDate).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Total Amount">
              ${parseFloat(selectedOrder.totalAmount).toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                selectedOrder.status === 'Completed' ? 'green' : 
                selectedOrder.status === 'Pending' ? 'orange' : 
                selectedOrder.status === 'Cancelled' ? 'red' : 'blue'
              }>
                {selectedOrder.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Method">
              {selectedOrder.paymentMethod}
            </Descriptions.Item>
            <Descriptions.Item label="Shipping Address">
              {selectedOrder.shippingAddress}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;