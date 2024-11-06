// src/components/Payment.js
import React, { useState } from 'react';
import { paymentService } from '../api';

const Payment = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handlePayment = async (orderId) => {
        try {
            const response = await paymentService.post('/payment', { orderId });
            setPaymentStatus(response.data);
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <div>
            <h2>Payment</h2>
            <button onClick={() => handlePayment('some-order-id')}>Make Payment</button>
            {paymentStatus && <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>}
        </div>
    );
};

export default Payment;
