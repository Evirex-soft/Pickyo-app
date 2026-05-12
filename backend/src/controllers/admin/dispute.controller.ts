import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getDisputeController = async (req: AuthRequest, res: Response) => {
    try {
        const [stats, list] = await Promise.all([
            // Aggragated stats
            prisma.dispute.groupBy({
                by: ['status'],
                _count: { id: true },
                _sum: { amount: true }
            }),

            // list
            prisma.dispute.findMany({
                include: {
                    ride: {
                        include: {
                            customer: { select: { name: true } },
                            driver: { select: { name: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
        ]);

        const summary = {
            total: list.length,
            pending: stats.find((s: any) => s.status === 'pending')?._count.id || 0,
            resolved: stats.find((s: any) => s.status === 'resolved')?._count.id || 0,
            refundedAmount: stats.find((s: any) => s.status === 'refunded')?._sum.amount || 0
        };

        logger.info('Dispute stats fetched successfully')

        res.json({ summary, disputes: list });
    } catch (error) {
        logger.error('Error fetching disputes', error)
        res.status(500).json({ message: 'Internal server error' });
    }
}