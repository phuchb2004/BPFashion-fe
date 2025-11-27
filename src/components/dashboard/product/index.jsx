import React, { useState, useEffect } from 'react';
import {
  Button, Space, Modal, Form, Input,
  Select, Card, Image, InputNumber, Table, Popconfirm, Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import baseApi from '../../../api/baseApi';
import getProductImageUrl from '../../../utils/productImageHelper';
import { showError, showFormNotification } from '../../../utils/notification';
import { useTranslation } from 'react-i18next';
import '../common/style.css';

const { TextArea } = Input;
const { Option } = Select;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await baseApi.get('/Products/GetProductsPaged?page=1&pageSize=1000');
      
      const allProducts = response?.products;
      
      const processedProducts = allProducts.map(product => ({
        ...product,
        categoryName: product.categoryName || 'Chưa phân loại',
        price: product.price || (product.Variants && product.Variants.length > 0 
          ? Math.min(...product.Variants.map(v => v.price || 0).filter(p => p > 0))
          : 0),
        stockQuantity: product.stockQuantity || (product.Variants && product.Variants.length > 0
          ? product.Variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0)
          : 0),
        categoryId: product.categoryId || product.category?.categoryId || 1,
      }));

      setProducts(processedProducts);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      showError(t('common.error'), t('dashboard.product.form.loadError'));
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
      showFormNotification(t('dashboard.product.delete.success'), t('dashboard.product.delete.successDesc'));
      fetchProducts();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      showError(t('dashboard.product.delete.error'), error.response?.data?.message || t('dashboard.product.delete.errorDesc'));
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (typeof values.price === 'string') {
        values.price = parseFloat(values.price.replace(/[₫,\s]/g, ''));
      }
      
      if (values.categoryId) {
        values.categoryId = parseInt(values.categoryId);
      }
      
      if (editingProduct) {
        await baseApi.put(`/Products/UpdateProduct/${editingProduct.productId}`, values);
        showFormNotification(t('dashboard.product.form.updateSuccess'), t('dashboard.product.form.updateSuccessDesc'));
      } else {
        await baseApi.post('/Products/CreateProduct', values);
        showFormNotification(t('dashboard.product.form.addSuccess'), t('dashboard.product.form.addSuccessDesc'));
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      showError(t('dashboard.product.form.saveError'), error.response?.data?.message || t('dashboard.product.form.saveErrorDesc'));
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'productId', key: 'productId', width: 80 },
    {
      title: t('dashboard.product.table.image'),
      key: 'image',
      width: 100,
      render: (_, record) => (
        <Image 
          width={60} 
          height={60}
          src={getProductImageUrl(record)} 
          alt={record.productName}
          style={{ objectFit: 'cover', borderRadius: '4px' }}
          fallback="/assets/logo2.png"
          preview={false}
        />
      ),
    },
    { 
      title: t('dashboard.product.table.name'), 
      dataIndex: 'productName', 
      key: 'productName',
      ellipsis: true
    },
    {
      title: t('dashboard.product.table.price'),
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => price > 0 
        ? `₫${Number(price).toLocaleString('vi-VN')}`
        : t('common.contact'),
    },
    { 
      title: t('dashboard.product.table.stock'), 
      dataIndex: 'stockQuantity', 
      key: 'stockQuantity',
      width: 100,
      align: 'center'
    },
    { 
      title: t('dashboard.product.table.category'), 
      dataIndex: 'categoryName', 
      key: 'categoryName',
      width: 120
    },
    {
      title: t('dashboard.product.table.action'),
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title={t('dashboard.product.delete.title')}
            description={t('dashboard.product.delete.confirm')}
            onConfirm={() => handleDelete(record.productId)}
            okText={t('dashboard.product.delete.ok')} cancelText={t('dashboard.product.delete.cancel')} okType="danger"
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
        <h2>{t('dashboard.product.title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('dashboard.product.add')}
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
        title={editingProduct ? t('dashboard.product.form.edit') : t('dashboard.product.form.add')}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        okText={editingProduct ? t('dashboard.product.form.update') : t('dashboard.product.form.submit')}
        cancelText={t('dashboard.product.form.cancel')}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="productName" 
            label={t('dashboard.product.form.name')} 
            rules={[{ required: true, message: t('dashboard.product.form.nameRequired') }]}
          >
            <Input placeholder={t('dashboard.product.form.namePlaceholder')} />
          </Form.Item>

          <Form.Item name="description" label={t('dashboard.product.form.description')}>
            <TextArea rows={4} placeholder={t('dashboard.product.form.descriptionPlaceholder')} />
          </Form.Item>

          <Form.Item 
            name="categoryId" 
            label={t('dashboard.product.form.category')} 
            rules={[{ required: true, message: t('dashboard.product.form.categoryRequired') }]}
          >
            <Select placeholder={t('dashboard.product.form.categoryPlaceholder')}>
              <Option value={1}>{t('header.menu.shirts')}</Option>
              <Option value={2}>{t('header.menu.pants')}</Option>
              <Option value={3}>{t('header.menu.accessories')}</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="price" 
            label={t('dashboard.product.form.price')} 
            rules={[{ required: true, message: t('dashboard.product.form.priceRequired') }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={1000}
              formatter={value => value ? `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={value => value ? value.replace(/₫\s?|(,*)/g, '') : ''}
              placeholder={t('dashboard.product.form.pricePlaceholder')}
            />
          </Form.Item>

          <Form.Item 
            name="stockQuantity" 
            label={t('dashboard.product.form.stock')} 
            rules={[{ required: true, message: t('dashboard.product.form.stockRequired') }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              placeholder={t('dashboard.product.form.stockPlaceholder')}
            />
          </Form.Item>

          <Form.Item name="material" label={t('dashboard.product.form.material')}>
            <Input placeholder={t('dashboard.product.form.materialPlaceholder')} />
          </Form.Item>

          <Form.Item name="size" label={t('dashboard.product.form.size')}>
            <Input placeholder={t('dashboard.product.form.sizePlaceholder')} />
          </Form.Item>

          <Form.Item name="imageUrl" label={t('dashboard.product.form.imageUrl')}>
            <Input placeholder={t('dashboard.product.form.imageUrlPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;