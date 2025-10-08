import React, { useState, useEffect } from 'react';
import {
  Button, Space, Modal, Form, Input,
  Select, message, Card, Image, InputNumber, Table, Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axiosSystem from '../../../api/axiosSystem';
import '../common/style.css'; // Sử dụng CSS chung

const { TextArea } = Input;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosSystem.get('/Products/GetAllProducts');
      setProducts(response || []);
    } catch (error) {
      message.error('Lấy dữ liệu sản phẩm thất bại!', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      price: record.price.toString()
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosSystem.delete(`/Products/DeleteProduct/${id}`);
      message.success('Xóa thành công!');
      fetchProducts();
    } catch (error) {
      message.error('Xóa thất bại', error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        await axiosSystem.put(`/Products/UpdateProduct/${editingProduct.productId}`, values);
        message.success('Cập nhật thành công');
      } else {
        await axiosSystem.post('/Products/CreateProduct', values);
        message.success('Thêm thành công');
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Lưu thất bại', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'productId', key: 'productId' },
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url, record) => <Image width={60} src={url} alt={record.productName} />,
    },
    { title: 'Tên sản phẩm', dataIndex: 'productName', key: 'productName' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₫${parseFloat(price).toLocaleString('vi-VN')}`,
    },
    { title: 'Tồn kho', dataIndex: 'stockQuantity', key: 'stockQuantity' },
    { title: 'Danh mục', dataIndex: 'categoryName', key: 'categoryName' },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.productId)}
            okText="Có" cancelText="Không" okType="danger"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className='dashboard-page-container'>
      <div className="dashboard-page-header">
        <h2>Quản lý Sản phẩm</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      </div>
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          rowKey="productId"
        />
      </Card>

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="productName" label="Product Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={1000}
              formatter={value => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>

          <Form.Item name="stockQuantity" label="Stock Quantity" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="material" label="Material">
            <Input />
          </Form.Item>

          <Form.Item name="size" label="Size">
            <Input />
          </Form.Item>

          <Form.Item name="imageUrl" label="Image URL">
            <Input />
          </Form.Item>

          <Form.Item name="categoryId" label="Category ID">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;