import React, { useState, useEffect } from 'react';
import {
  Button, Space, Modal, Form, Input,
  Select, Card, Image, InputNumber, Table, Popconfirm, Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import baseApi from '../../../api/baseApi';
import getProductImageUrl from '../../../utils/productImageHelper';
import { showError, showFormNotification } from '../../../utils/notification';
import '../common/style.css';

const { TextArea } = Input;
const { Option } = Select;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Use GetProductsPaged with large pageSize to get all products
      const response = await baseApi.get('/Products/GetProductsPaged?page=1&pageSize=1000');
      
      // Handle API response format: { products: [...], totalCount: number }
      const allProducts = response?.products || response?.data?.products || response?.data || response || [];
      
      // Process products to handle Variants from new API format
      const processedProducts = allProducts.map(product => ({
        ...product,
        // Handle CategoryName vs categoryName
        categoryName: product.CategoryName || product.categoryName || 'Chưa phân loại',
        // Handle price from product level or Variants
        price: product.price || (product.Variants && product.Variants.length > 0 
          ? Math.min(...product.Variants.map(v => v.price || 0).filter(p => p > 0))
          : 0),
        // Handle stockQuantity from Variants (sum of all variants)
        stockQuantity: product.stockQuantity || (product.Variants && product.Variants.length > 0
          ? product.Variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0)
          : 0),
        // Preserve categoryId for form
        categoryId: product.categoryId || product.category?.categoryId || 1,
      }));

      setProducts(processedProducts);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      showError('Lỗi', 'Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
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
      productName: record.productName,
      description: record.description,
      price: record.price || 0,
      stockQuantity: record.stockQuantity || 0,
      material: record.material || '',
      size: record.size || '',
      imageUrl: record.imageUrl || '',
      categoryId: record.categoryId || record.category?.categoryId || 1,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await baseApi.delete(`/Products/DeleteProduct/${id}`);
      showFormNotification('Xóa thành công!', 'Sản phẩm đã được xóa khỏi hệ thống.');
      fetchProducts();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      showError('Xóa thất bại', error.response?.data?.message || 'Không thể xóa sản phẩm này.');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Convert price to number if it's a string
      if (typeof values.price === 'string') {
        values.price = parseFloat(values.price.replace(/[₫,\s]/g, ''));
      }
      
      // Ensure categoryId is a number
      if (values.categoryId) {
        values.categoryId = parseInt(values.categoryId);
      }
      
      if (editingProduct) {
        await baseApi.put(`/Products/UpdateProduct/${editingProduct.productId}`, values);
        showFormNotification('Cập nhật thành công', 'Thông tin sản phẩm đã được cập nhật.');
      } else {
        await baseApi.post('/Products/CreateProduct', values);
        showFormNotification('Thêm thành công', 'Sản phẩm mới đã được thêm vào hệ thống.');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      showError('Lưu thất bại', error.response?.data?.message || 'Không thể lưu thông tin sản phẩm.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'productId', key: 'productId', width: 80 },
    {
      title: 'Ảnh',
      key: 'image',
      width: 100,
      render: (_, record) => (
        <Image 
          width={60} 
          height={60}
          src={getProductImageUrl(record)} 
          alt={record.productName}
          style={{ objectFit: 'cover', borderRadius: '4px' }}
          fallback="/assets/placeholder-product.jpg"
          preview={false}
        />
      ),
    },
    { 
      title: 'Tên sản phẩm', 
      dataIndex: 'productName', 
      key: 'productName',
      ellipsis: true
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => price > 0 
        ? `₫${Number(price).toLocaleString('vi-VN')}`
        : 'Liên hệ',
    },
    { 
      title: 'Tồn kho', 
      dataIndex: 'stockQuantity', 
      key: 'stockQuantity',
      width: 100,
      align: 'center'
    },
    { 
      title: 'Danh mục', 
      dataIndex: 'categoryName', 
      key: 'categoryName',
      width: 120
    },
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
        title={editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        okText={editingProduct ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="productName" 
            label="Tên sản phẩm" 
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item 
            name="categoryId" 
            label="Danh mục" 
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              <Option value={1}>Áo</Option>
              <Option value={2}>Quần</Option>
              <Option value={3}>Phụ kiện</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="price" 
            label="Giá (VNĐ)" 
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={1000}
              formatter={value => value ? `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={value => value ? value.replace(/₫\s?|(,*)/g, '') : ''}
              placeholder="Nhập giá sản phẩm"
            />
          </Form.Item>

          <Form.Item 
            name="stockQuantity" 
            label="Số lượng tồn kho" 
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              placeholder="Nhập số lượng"
            />
          </Form.Item>

          <Form.Item name="material" label="Chất liệu">
            <Input placeholder="Ví dụ: Cotton, Polyester, ..." />
          </Form.Item>

          <Form.Item name="size" label="Kích thước">
            <Input placeholder="Ví dụ: S, M, L, XL hoặc 28, 30, 32" />
          </Form.Item>

          <Form.Item name="imageUrl" label="URL hình ảnh">
            <Input placeholder="Nhập URL hình ảnh (hoặc để trống để tự động chọn từ assets)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;