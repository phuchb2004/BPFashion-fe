import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import './style.css';

/**
 * Breadcrumb component chung cho toàn bộ ứng dụng
 * @param {Array} items - Mảng các item breadcrumb: [{ title: string|ReactNode, href?: string, onClick?: function }]
 * @param {string} className - CSS class tùy chỉnh
 * @param {Object} style - Inline styles
 */
export default function Breadcrumb({ 
  items = [], 
  className = '', 
  style = {}
}) {
  const navigate = useNavigate();

  // Xử lý onClick cho các items
  const breadcrumbItems = React.useMemo(() => {
    return items.map((item, index) => {
      const isLastItem = index === items.length - 1;
      
      // Tạo một item mới với onClick được xử lý
      const processedItem = { ...item };
      
      // Nếu không có onClick và có href (không phải item cuối), tạo onClick
      if (!item.onClick && item.href && typeof item.href === 'string' && !isLastItem) {
        processedItem.onClick = () => {
          if (item.href.startsWith('/')) {
            navigate(item.href);
          } else {
            window.location.href = item.href;
          }
        };
      }
      
      return processedItem;
    });
  }, [items, navigate]);

  return (
    <div className={`custom-breadcrumb-wrapper ${className}`} style={style}>
      <AntBreadcrumb 
        items={breadcrumbItems}
        className="custom-breadcrumb"
      />
    </div>
  );
}

