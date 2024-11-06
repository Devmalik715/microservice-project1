// src/components/Order.js
import React, { useState } from 'react';
import { orderService } from '../api';

const Order = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await orderService.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div>
            <h2>Order</h2>
            <button onClick={fetchOrders}>Fetch Orders</button>
            {orders.map((order) => (
                <div key={order._id}>
                    <p>Order ID: {order._id}</p>
                    <p>Status: {order.status}</p>
                </div>
            ))}
        </div>
    );
};

export default Order;
