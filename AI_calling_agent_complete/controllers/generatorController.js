const Script = require('../models/Script');
const User = require('../models/User');
const { generateScriptWithGroq } = require('../services/groqService');

// @desc    Show generator form / pricing if limit reached
// @route   GET /generator
// @access  Private
exports.getGeneratorPage = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        
        // Admins and paid users skip the limit check
        if (user.role !== 'admin' && user.subscriptionStatus === 'trial' && user.remainingGenerations <= 0) {
            return res.render('pricing', { user });
        }
        
        // Fetch user's previously generated scripts
        const scripts = await Script.find({ user: user._id }).sort({ createdAt: -1 });

        res.render('generator', { user, scripts });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Server Error');
        res.redirect('/');
    }
};

// @desc    Generate new AI script
// @route   POST /generator
// @access  Private
exports.generateScript = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);

        // Admins bypass trial limits
        if (user.role !== 'admin' && user.subscriptionStatus === 'trial' && user.remainingGenerations <= 0) {
            return res.status(403).json({ 
                success: false, 
                message: 'Free trial limit reached. Please upgrade to continue.',
                limitReached: true 
            });
        }

        const { businessName, businessType, targetAudience, goal, tone, language, scriptType, servicesOffered, painPoints, notes } = req.body;

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ success: false, message: 'Groq API Key is not configured. Please add GROQ_API_KEY to .env file.' });
        }

        const generatedContent = await generateScriptWithGroq(req.body);

        const newScript = new Script({
            user: user._id,
            businessName,
            businessType,
            targetAudience,
            goal,
            tone,
            language,
            scriptType,
            generatedScript: generatedContent
        });

        await newScript.save();

        // Only decrement for trial users, not admins
        if (user.role !== 'admin' && user.subscriptionStatus === 'trial') {
            user.remainingGenerations -= 1;
            user.freeTrialUsed = true;
            await user.save();
        }

        res.json({ 
            success: true, 
            script: generatedContent, 
            remaining: user.role === 'admin' ? 'Unlimited' : user.remainingGenerations 
        });
    } catch (error) {
        console.error("Generator Error:", error);
        // Pass the specific AI error message to the frontend
        res.status(500).json({ 
            success: false, 
            message: error.message || 'An unexpected error occurred during generation.' 
        });
    }
};
