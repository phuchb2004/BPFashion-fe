import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { useNavigate } from 'react-router-dom';
import './style.css';

export default function Breadcrumb({ 
  items = [], 
  className = '', 
  style = {}
}) {
  const navigate = useNavigate();

  const breadcrumbItems = React.useMemo(() => {
    return items.map((item, index) => {
      const isLastItem = index === items.length - 1;
      const processedItem = { ...item };
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

