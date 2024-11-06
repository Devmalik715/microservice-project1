// src/api.js
import axios from 'axios';

const userService = axios.create({ baseURL: process.env.REACT_APP_USER_SERVICE_URL });
const productService = axios.create({ baseURL: process.env.REACT_APP_PRODUCT_SERVICE_URL });
const orderService = axios.create({ baseURL: process.env.REACT_APP_ORDER_SERVICE_URL });
const paymentService = axios.create({ baseURL: process.env.REACT_APP_PAYMENT_SERVICE_URL });

export { userService, productService, orderService, paymentService };
