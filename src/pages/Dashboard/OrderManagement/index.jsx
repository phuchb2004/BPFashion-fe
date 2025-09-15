import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Descriptions, Select, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axiosSystem from '../../../api/axiosSystem';

const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Dữ liệu mẫu
  const sampleOrders = [
    {
      orderId: 1001,
      userName: 'Nguyễn Văn A',
      orderDate: '2023-10-15T14:30:00',
      totalAmount: 750000,
      status: 'Completed',
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Đường ABC, Quận 1, TP.HCM'
    },
    {
      orderId: 1002,
      userName: 'Trần Thị B',
      orderDate: '2023-10-16T09:15:00',
      totalAmount: 1130000,
      status: 'Processing',
      paymentMethod: 'COD',
      shippingAddress: '456 Đường XYZ, Quận 3, TP.HCM'
    },
    {
      orderId: 1003,
      userName: 'Lê Văn C',
      orderDate: '2023-10-17T16:45:00',
      totalAmount: 680000,
      status: 'Pending',
      paymentMethod: 'Momo',
      shippingAddress: '789 Đường DEF, Quận 5, TP.HCM'
    },
    {
      orderId: 1004,
      userName: 'Phạm Thị D',
      orderDate: '2023-10-18T11:20:00',
      totalAmount: 1250000,
      status: 'Completed',
      paymentMethod: 'Bank Transfer',
      shippingAddress: '321 Đường GHI, Quận 10, TP.HCM'
    },
    {
      orderId: 1005,
      userName: 'Hoàng Văn E',
      orderDate: '2023-10-19T15:40:00',
      totalAmount: 890000,
      status: 'Cancelled',
      paymentMethod: 'Credit Card',
      shippingAddress: '654 Đường JKL, Quận Tân Bình, TP.HCM'
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Sử dụng dữ liệu mẫu thay vì gọi API
      // const response = await axiosSystem.get('/Orders/GetAllOrders');
      // setOrders(response.data);
      setOrders(sampleOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Nếu có lỗi, vẫn sử dụng dữ liệu mẫu
      setOrders(sampleOrders);
    } finally {
      setLoading(false);
    }
  };

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
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${parseFloat(amount).toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        switch (status) {
          case 'Completed': color = 'green'; break;
          case 'Pending': color = 'orange'; break;
          case 'Cancelled': color = 'red'; break;
          case 'Processing': color = 'blue'; break;
          default: color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => showOrderDetails(record)}
          >
            View
          </Button>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
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
    <div>
      <h2>Order Management</h2>
      <Table 
        columns={columns} 
        dataSource={orders} 
        loading={loading}
        rowKey="orderId"
      />

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