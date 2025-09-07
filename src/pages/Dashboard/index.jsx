import React, { useState } from 'react';
import './style.css';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';

export default function Dashboard() {
    const [isDisplay, setIsDisplay] = useState('user');

    return (
        <div className="dashboardContainer">
            <aside className="sideBar">
                <ul className="sidebarMenu">
                    <li>Dashboard</li>
                    <li onClick={() => setIsDisplay('product')} className={isDisplay === 'product' ? 'active' : ''}>Product</li>
                    <li onClick={() => setIsDisplay('order')} className={isDisplay === 'order' ? 'active' : ''}>Order</li>
                    <li onClick={() => setIsDisplay('user')} className={isDisplay === 'user' ? 'active' : ''}>User</li>
                </ul>
            </aside>

            <main className="mainContent">
                {isDisplay === 'product'  && <ProductManagement/>}
                {isDisplay === 'order' && <OrderManagement/>}
                {isDisplay === 'user' && <UserManagement/>}
            </main>
        </div>
    )
}