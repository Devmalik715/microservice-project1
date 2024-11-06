// src/App.js
import React from 'react';
import './App.css';
import User from './components/User';
import Product from './components/Product';
import Order from './components/Order';
import Payment from './components/Payment';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Microservices Dashboard</h1>
            </header>
            <main>
                <User />
                <Product />
                <Order />
                <Payment />
            </main>
        </div>
    );
}

export default App;

