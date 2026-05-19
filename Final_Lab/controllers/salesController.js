const User = require('../../AI_calling_agent_complete/models/User');
const Script = require('../../AI_calling_agent_complete/models/Script');
const Product = require('../../AI_calling_agent_complete/models/Product');

// Plan Prices
const PLAN_PRICES = {
    'Free Trial': 0,
    'Basic': 29,
    'Professional': 99,
    'Enterprise': 299
};

/**
 * Calculate Sales Statistics
 */
async function calculateSalesStats() {
    // 1. Total Revenue calculation based on User subscription plans
    const userStats = await User.aggregate([
        {
            $group: {
                _id: "$subscriptionPlan",
                count: { $sum: 1 }
            }
        }
    ]);

    let totalRevenue = 0;
    let topPackage = "None";
    let maxCount = -1;

    userStats.forEach(stat => {
        const price = PLAN_PRICES[stat._id] || 0;
        totalRevenue += (price * stat.count);

        if (stat._id !== 'Free Trial' && stat.count > maxCount) {
            maxCount = stat.count;
            topPackage = stat._id;
        }
    });

    // 2. Total AI Script Generations
    const totalGenerations = await Script.countDocuments();

    // 3. Active Users (Users with a paid plan or recently active)
    const activeUsers = await User.countDocuments({ 
        subscriptionPlan: { $ne: 'Free Trial' } 
    });
    
    const totalUsers = await User.countDocuments();

    // 4. Recent Activity (Latest scripts and registrations)
    const recentScripts = await Script.find()
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5);

    return {
        totalRevenue,
        totalGenerations,
        activeUsers,
        totalUsers,
        topPackage,
        recentActivity: {
            scripts: recentScripts,
            users: recentUsers
        }
    };
}

/**
 * @desc    Render Sales Dashboard
 * @route   GET /sales
 * @access  Admin
 */
exports.getSalesDashboard = async (req, res) => {
    try {
        const stats = await calculateSalesStats();
        res.render('sales', { 
            title: 'Sales Dashboard',
            stats,
            user: req.session.user 
        });
    } catch (error) {
        console.error('Sales Dashboard Error:', error);
        res.status(500).render('index', { error_msg: 'Error loading sales dashboard' });
    }
};

/**
 * @desc    Get Live Sales Data JSON
 * @route   GET /api/sales-data
 * @access  Admin
 */
exports.getSalesDataAPI = async (req, res) => {
    try {
        const stats = await calculateSalesStats();
        res.json({
            success: true,
            totalRevenue: stats.totalRevenue,
            totalOrders: stats.totalGenerations, // Mapping generations to transactions
            topPackage: stats.topPackage,
            activeUsers: stats.activeUsers,
            totalUsers: stats.totalUsers,
            recentActivity: stats.recentActivity
        });
    } catch (error) {
        console.error('Sales API Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
