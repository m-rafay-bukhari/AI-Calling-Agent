const Groq = require('groq-sdk');

exports.generateScriptWithGroq = async (data) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is missing from environment variables.");
    }

    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
    });

    const { businessName, businessType, targetAudience, goal, tone, language, scriptType, servicesOffered, painPoints, notes } = data;
    
    const prompt = `
        You are an expert sales and customer service AI scriptwriter. 
        Please write a highly effective ${scriptType} script in ${language} with a ${tone} tone.
        
        Business Details:
        - Business Name: ${businessName}
        - Business Type: ${businessType}
        - Target Audience: ${targetAudience}
        - Goal of the Call: ${goal}
        - Services Offered: ${servicesOffered || 'N/A'}
        - Customer Pain Points: ${painPoints || 'N/A'}
        - Additional Notes: ${notes || 'N/A'}
        
        Provide the script clearly formatted. Include placeholder brackets like [Customer Name] where the caller should insert specific info.
    `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert telemarketing and customer service script generator."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile", // Updated to a supported model
        });

        return completion.choices[0]?.message?.content || "Failed to generate script.";
    } catch (error) {
        console.error("Groq API Error Details:", error);
        
        // Return a more descriptive error if possible
        if (error.status === 401) {
            throw new Error("Invalid Groq API Key. Please check your .env file.");
        } else if (error.status === 404) {
            throw new Error("The requested AI model was not found.");
        } else if (error.status === 429) {
            throw new Error("Groq API Rate limit reached. Please try again later.");
        }
        
        throw new Error(`AI Service Error: ${error.message || "Failed to communicate with Groq."}`);
    }
};
