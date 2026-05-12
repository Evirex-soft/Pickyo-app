import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getPromoController = async (req: AuthRequest, res: Response) => {
    try {
        const [promos, activeStats] = await Promise.all([
            prisma.promoCode.findMany({
                orderBy: { createdAt: 'desc' }
            }),
            prisma.promoCode.aggregate({
                where: { isActive: true },
                _count: { id: true },
                _sum: { usedCount: true }
            })
        ]);

        logger.info('Fetched promo codes and stats successfully');
        res.json({
            summary: {
                totalActive: activeStats._count.id,
                totalRedemptions: activeStats._sum.usedCount || 0,
                upcomingExpirations: promos.filter((p: any) => {
                    const diff = new Date(p.expiryDate).getTime() - new Date().getTime();
                    return diff > 0 && diff < (3 * 24 * 60 * 60 * 1000);
                }).length
            },
            promos
        });
    } catch (error) {
        logger.error('Error fetching promo codes:', error);
        res.status(500).json({
            message: 'Failed to fetch promo codes'
        })
    }
}