import { Response } from "express";
import { prisma } from '../../config/prisma';
import { AuthRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";

export const getPaymentController = async (req: AuthRequest, res: Response) => {
    try {
        const [stats, methodStats, recentPayments] = await Promise.all([
            // Payments
            prisma.payment.aggregate({
                _sum: { amount: true, adminCommission: true, driverEarning: true },
                where: { status: 'paid' }
            }),

            // Payment Distribution
            prisma.payment.groupBy({
                by: ['method'],
                _count: { id: true },
                _sum: { amount: true }
            }),

            // Transaction
            prisma.payment.findMany({
                include: {
                    ride: {
                        include: {
                            customer: { select: { name: true, email: true } },
                            driver: { select: { name: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 15
            })
        ]);

        logger.info("Fetched payment data successfully");

        res.json({
            summary: {
                totalVolume: stats._sum.amount || 0,
                netRevenue: stats._sum.adminCommission || 0,
                driverPayouts: stats._sum.driverEarning || 0,
                successRate: 98.4
            },
            methods: methodStats.map(m => ({
                name: m.method.replace('_', ' '),
                count: m._count.id,
                value: m._sum.amount
            })),
            transactions: recentPayments
        });

    } catch (error) {
        logger.error("Error while fetching payment data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};