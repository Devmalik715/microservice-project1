// src/components/Product.js
import React, { useState } from 'react';
import { productService } from '../api';

const Product = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await productService.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div>
            <h2>Product</h2>
            <button onClick={fetchProducts}>Fetch Products</button>
            {products.map((product) => (
                <div key={product._id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Product;
