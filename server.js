require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const connectDB = require('./AI_calling_agent_complete/config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'AI_calling_agent_complete/public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'AI_calling_agent_complete/views'),
    path.join(__dirname, 'Final_Lab/views')
]);

// Session config
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.default.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Flash messages & Globals
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
});

// API Routes
app.use('/api/v1/auth', require('./AI_calling_agent_complete/routes/api/v1/auth'));
app.use('/api/v1/products', require('./AI_calling_agent_complete/routes/api/v1/products'));
app.use('/api/v1/orders', require('./AI_calling_agent_complete/routes/api/v1/orders'));
app.use('/api/v1/user', require('./AI_calling_agent_complete/routes/api/v1/user'));

// Sales Dashboard Routes (Final Lab)
app.use('/', require('./Final_Lab/routes/salesRoutes'));

// Basic Routes
app.use('/', require('./AI_calling_agent_complete/routes/authRoutes'));

const { isLoggedIn, isAdmin } = require('./AI_calling_agent_complete/middleware/auth');
app.use('/admin', isAdmin, require('./AI_calling_agent_complete/routes/adminRoutes'));
app.use('/products', require('./AI_calling_agent_complete/routes/productRoutes'));
app.use('/favorites', require('./AI_calling_agent_complete/routes/favoriteRoutes'));
app.use('/generator', require('./AI_calling_agent_complete/routes/generatorRoutes'));

app.get('/pricing', (req, res) => {
    res.render('pricing', { user: req.session?.user });
});

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
