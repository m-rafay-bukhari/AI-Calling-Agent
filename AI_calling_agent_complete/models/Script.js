const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    businessType: {
        type: String,
        required: true
    },
    targetAudience: {
        type: String,
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    tone: {
        type: String,
        default: 'Professional'
    },
    language: {
        type: String,
        default: 'English'
    },
    scriptType: {
        type: String,
        required: true
    },
    generatedScript: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Script', scriptSchema);
