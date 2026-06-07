import { createUser, getUserByWhatsappNumber } from "../repositories/userRepository.js";

const validateUserServiceData = (user) => {
    if (!user) {
        throw new Error("Validation failed: User data is empty.");
    }
    if (!user.name || typeof user.name !== 'string' || user.name.trim() === '') {
        throw new Error("Validation failed: User name must be a valid non-empty string.");
    }
    if (user.age === undefined || user.age === null || typeof user.age !== 'number' || user.age < 1 || user.age > 120) {
        throw new Error("Validation failed: User age must be a number between 1 and 120.");
    }
    if (!user.whatsappNumber || typeof user.whatsappNumber !== 'string') {
        throw new Error("Validation failed: WhatsApp number is required.");
    }
};

export const createUserService = async (user) => {
    try {
        // Perform business validation
        validateUserServiceData(user);

        const existingUser = await getUserByWhatsappNumber(user.whatsappNumber);
        if (existingUser) {
             throw new Error("User already exists");
        }
        const createdUser = await createUser(user);
        return createdUser;
    } catch (error) {
        throw error;
    }
};


export const getUserService = async (whatsappNumber) => {
    try {
        // Perform business validation
        if (!whatsappNumber || typeof whatsappNumber !== 'string') {
            throw new Error("Validation failed: WhatsApp number is required.");
        }
        const user = await getUserByWhatsappNumber(whatsappNumber);
        return user;
    } catch (error) {
        throw error;
    }
};