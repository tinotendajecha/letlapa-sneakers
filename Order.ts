import React from 'react';

interface OrderProps {
    orderId?: string;
}

const Order: React.FC<OrderProps> = ({ orderId = '1' }) => {
    return (
        <div className="order">
            <h1>Order {orderId}</h1>
            <p>This is a dummy order component.</p>
        </div>
    );
};

export default Order;