const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./AI_calling_agent_complete/models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const sampleProducts = [
    { name: 'Wireless Headphones', price: 99.99, description: 'High quality wireless headphones with noise cancellation.', category: 'Headphones', rating: 4.5, stock: 50, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { name: 'Smartphone Pro Max', price: 1099.99, description: 'Latest smartphone with amazing camera and battery life.', category: 'Electronics', rating: 4.8, stock: 30, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
    { name: 'Gaming Laptop', price: 1499.50, description: 'Powerful gaming laptop with RTX 4070.', category: 'Laptops', rating: 4.7, stock: 15, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80' },
    { name: '4K Action Camera', price: 299.99, description: 'Waterproof 4K action camera for extreme sports.', category: 'Cameras', rating: 4.6, stock: 25, image: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=500&q=80' },
    { name: 'Smartwatch Series 8', price: 399.00, description: 'Advanced fitness tracking and health monitor.', category: 'Electronics', rating: 4.5, stock: 40, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80' },
    { name: 'Bluetooth Speaker', price: 59.99, description: 'Portable waterproof bluetooth speaker.', category: 'Electronics', rating: 4.3, stock: 100, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80' },
    { name: 'Mechanical Keyboard', price: 129.99, description: 'RGB mechanical keyboard with cherry MX switches.', category: 'Accessories', rating: 4.8, stock: 35, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
    { name: 'Wireless Mouse', price: 49.99, description: 'Ergonomic wireless mouse for productivity.', category: 'Accessories', rating: 4.4, stock: 60, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
    { name: 'Noise Cancelling Earbuds', price: 149.99, description: 'True wireless noise cancelling earbuds.', category: 'Headphones', rating: 4.6, stock: 45, image: 'https://images.unsplash.com/photo-1572569438065-807586590f50?w=500&q=80' },
    { name: '27-inch 4K Monitor', price: 349.99, description: 'IPS 4K monitor for designers and gamers.', category: 'Electronics', rating: 4.7, stock: 20, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' },
    { name: 'Coffee Maker', price: 79.99, description: 'Programmable coffee maker with glass carafe.', category: 'Home', rating: 4.2, stock: 55, image: 'https://images.unsplash.com/photo-1495474472201-44bb594162ec?w=500&q=80' },
    { name: 'Running Shoes', price: 119.99, description: 'Comfortable running shoes for daily workouts.', category: 'Clothes/Shoes', rating: 4.5, stock: 80, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    { name: 'Yoga Mat', price: 29.99, description: 'Non-slip yoga mat with carrying strap.', category: 'Sports', rating: 4.7, stock: 120, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80' },
    { name: 'Protein Powder', price: 45.00, description: 'Whey protein isolate, chocolate flavor.', category: 'Food', rating: 4.6, stock: 75, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&q=80' },
    { name: 'Fiction Bestseller', price: 14.99, description: 'New York Times bestseller fiction novel.', category: 'Books', rating: 4.8, stock: 200, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80' },
    { name: 'Skincare Routine Set', price: 89.99, description: 'Complete daily skincare routine set.', category: 'Beauty/Health', rating: 4.5, stock: 40, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80' },
    { name: 'Camping Tent', price: 199.99, description: '4-person waterproof camping tent.', category: 'Outdoor', rating: 4.3, stock: 15, image: 'https://images.unsplash.com/photo-1504280390224-dd94273010b9?w=500&q=80' },
    { name: 'Hiking Backpack', price: 129.99, description: '65L hiking backpack with hydration sleeve.', category: 'Outdoor', rating: 4.6, stock: 30, image: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500&q=80' },
    { name: 'Electric Toothbrush', price: 59.99, description: 'Rechargeable electric toothbrush with timer.', category: 'Beauty/Health', rating: 4.7, stock: 85, image: 'https://images.unsplash.com/photo-1554904482-eb0df3ec45fb?w=500&q=80' },
    { name: 'Desk Lamp', price: 34.99, description: 'LED desk lamp with adjustable brightness.', category: 'Home', rating: 4.4, stock: 65, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' }
];

const seedDB = async () => {
    try {
        await connectDB();
        await Product.deleteMany();
        console.log('Products deleted.');
        await Product.insertMany(sampleProducts);
        console.log('Products seeded successfully.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDB();
