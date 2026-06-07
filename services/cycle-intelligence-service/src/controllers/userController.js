import { createUserService , getUserService} from "../services/userService.js";

const validateCreateUserRequest = (data) => {
    const { name, age, whatsappNumber, insightPreferences } = data;
    
    // Check required fields
    if (!name || age === undefined || age === null || !whatsappNumber) {
        return "Fields 'name', 'age', and 'whatsappNumber' are required.";
    }
    
    // Name validation
    if (typeof name !== 'string' || name.trim().length < 2) {
        return "Name must be a string and at least 2 characters long.";
    }
    
    // Age validation
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
        return "Age must be an integer between 1 and 120.";
    }
    
    // WhatsApp validation (simple E.164 check)
    const phoneRegex = /^[1-9]\d{1,14}$/;
    if (typeof whatsappNumber !== 'string' || !phoneRegex.test(whatsappNumber.trim())) {
        return "WhatsApp number must be in valid E.164 format (e.g., +1234567890).";
    }
    
    // Optional Insight Preferences validation
    if (insightPreferences !== undefined && insightPreferences !== null && typeof insightPreferences !== 'string') {
        return "Insight preferences must be a string.";
    }
    
    return null;
};

export const createUserController = async (req, res) => {
    try {
        const validationError = validateCreateUserRequest(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const { name, age, whatsappNumber, insightPreferences } = req.body;
        const user = {
            name: name.trim(),
            age: parseInt(age, 10),
            whatsappNumber: whatsappNumber.trim(),
            insightPreferences: insightPreferences ? insightPreferences.trim() : null,
        };

        const createdUser = await createUserService(user);
        return res.status(201).json({"message":"User created successfully", user: createdUser});
    } catch (error) {
        if (error.message === "User already exists" || error.message.includes("Validation failed")) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};


export const getUserController = async (req, res) => {
    try {
        const { whatsappNumber } = req.params;
        if (!whatsappNumber) {
            return res.status(400).json({ error: "WhatsApp number is required." });
        }

        const user = await getUserService(whatsappNumber.trim());
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json({"message":"User fetched successfully", user});
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};