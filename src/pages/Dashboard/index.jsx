import React, { useState } from 'react';
import './style.css';
import ProductManagement from '../../components/ProductManagement';
import OrderManagement from '../../components/OrderManagement';
import UserManagement from '../../components/UserManagement';

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