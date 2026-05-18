const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    avatar: {
        type: String,
        default: '/uploads/default-avatar.png'
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    freeTrialUsed: {
        type: Boolean,
        default: false
    },
    subscriptionStatus: {
        type: String,
        enum: ['trial', 'active', 'inactive'],
        default: 'trial'
    },
    subscriptionPlan: {
        type: String,
        enum: ['Free Trial', 'Basic', 'Professional', 'Enterprise'],
        default: 'Free Trial'
    },
    remainingGenerations: {
        type: Number,
        default: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
