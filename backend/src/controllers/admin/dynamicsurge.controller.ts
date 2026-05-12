import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getSurgePricingController = async (req: AuthRequest, res: Response) => {
    try {
        const surge = await prisma.surgePricing.findFirst({
            where: {
                active: true,
                city: "Global"
            },
            orderBy: {
                startTime: "desc"
            }
        });

        if (surge) {
            return res.json({ multiplier: surge.multiplier });
        }

        return res.json({ multiplier: 1.0 });
    } catch (error) {
        logger.error("Error fetching surge pricing", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateSurgePricingController = async (req: AuthRequest, res: Response) => {
    try {
        const { multiplier } = req.body;

        if (typeof multiplier !== 'number' || multiplier < 1.0) {
            return res.status(400).json({ message: "Invalid multiplier" });
        }

        // Deactivate all current global surge prices
        await prisma.surgePricing.updateMany({
            where: {
                active: true,
                city: "Global"
            },
            data: {
                active: false,
                endTime: new Date()
            }
        });

        // Create new global surge pricing
        const newSurge = await prisma.surgePricing.create({
            data: {
                city: "Global",
                multiplier,
                active: true,
                startTime: new Date(),
                endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to 24 hours
            }
        });

        logger.info(`Global surge pricing updated to ${multiplier}x by admin ${req.user.userId}`);
        res.json({ multiplier: newSurge.multiplier, message: "Surge pricing updated successfully" });
    } catch (error) {
        logger.error("Error updating surge pricing", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};