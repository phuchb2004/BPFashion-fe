import React, { useState, useEffect } from 'react';
import {
  Button, Space, Modal, Form, Input,
  Select, DatePicker, message, Tag, Card, Spin, Image, InputNumber
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import axiosSystem from '../../../api/axiosSystem';
import moment from 'moment';
import './style.css';

const { Option } = Select;
const { TextArea } = Input;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
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
      message.error('Lấy dữ liệu thất bại', error);
      setProducts([]);
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

  return (
    <div>
      <div className="userTitle">
        <h2>Product Management</h2>
      </div>
      
      <div className="buttons">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="addButton">
          Add Product
        </Button>
      </div>

      <Card className="tableUsers">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>No products found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>{product.productName}</td>
                  <td>₫{parseFloat(product.price).toLocaleString()}</td>
                  <td>{product.stockQuantity}</td>
                  <td>{product.CategoryName || product.categoryName}</td>
                  <td>{product.BrandName || product.brandName}</td>
                  <td>
                    {product.imageUrl ? (
                      <Image width={50} src={product.imageUrl} alt={product.productName} />
                    ) : (
                      'No image'
                    )}
                  </td>
                  <td>
                    <Space size="middle" className="actionButtons">
                      <Button 
                        type="primary" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(product)} 
                        className="actionButton edit"
                      >
                        
                      </Button>
                      <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDelete(product.productId)} 
                        className="actionButton delete"
                      >
                        
                      </Button>
                    </Space>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

          <Form.Item name="brandId" label="Brand ID">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;