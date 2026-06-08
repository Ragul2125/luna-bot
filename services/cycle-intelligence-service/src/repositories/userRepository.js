import prisma from "../../../../shared/prisma/prisma.client.js"

const validateUserRepositoryData = (userData) => {
    if (!userData) {
        throw new Error("Database validation error: User data must not be empty.");
    }
    if (!userData.name || !userData.whatsappNumber) {
        throw new Error("Database validation error: Missing name or whatsappNumber.");
    }
};

export const getUserByWhatsappNumber = async (whatsappNumber) => {
    if (!whatsappNumber || typeof whatsappNumber !== 'string') {
        throw new Error("Database validation error: Valid WhatsApp number must be provided for lookup.");
    }
    return prisma.user.findUnique({
        where: {
            whatsappNumber: whatsappNumber
        }
    });
};

export const createUser = async (userData) => {
    validateUserRepositoryData(userData);
    return prisma.user.create({
        data: userData
    });
};

export const updateUserOnboarded = async (userId, onboarded) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error("Database validation error: Valid user ID must be provided for updates.");
    }
    return prisma.user.update({
        where: { id: userId },
        data: { onboarded }
    });
};


